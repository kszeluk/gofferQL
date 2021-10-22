import React from 'react';
import GraphiQL, { FetcherParams, SyncFetcherResult } from 'graphiql';
import 'graphiql/graphiql.css';
import { v4 } from 'uuid';

type Watchers = {
  [key: string]: (request: chrome.devtools.network.Request) => void;
};

interface IProps {
  query: string;
  variables: string;
  onGoBack: () => void;
}

export const SPECIAL_HEADER = '__graphiql-tool-id';

const getCodeToFetchGraphql = (url: string, params: unknown) =>
  `(function(){ return fetch("${url}", ${JSON.stringify(params)})})()`;

const graphQLFetcher =
  (watchers: Watchers) =>
  (graphQLParams: FetcherParams): Promise<SyncFetcherResult> => {
    const id: string = v4();
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [SPECIAL_HEADER]: id,
      },
      body: JSON.stringify(graphQLParams),
    };

    const promise = new Promise<SyncFetcherResult>(function (resolve) {
      const onRequestFinished = (request: chrome.devtools.network.Request) => {
        console.log(request.request);
        const isRequestSendByDevTool = request.request.headers.some(
          (header) => header.name === SPECIAL_HEADER && header.value === id
        );
        if (isRequestSendByDevTool) {
          chrome.devtools.network.onRequestFinished.removeListener(
            watchers[id]
          );
          request.getContent((content: string) => {
            const contentValue = JSON.parse(content);
            if (
              request.request.postData!.text!.includes('IntrospectionQuery')
            ) {
              contentValue.data.__schema.types =
                contentValue.data.__schema.types.map((type: any) => {
                  if (type.kind === 'INTERFACE' && !type.interfaces) {
                    return { ...type, interfaces: null };
                  }

                  return type;
                });
            }

            resolve(contentValue);
          });
        }
      };
      watchers[id] = onRequestFinished;
      chrome.devtools.network.onRequestFinished.addListener(onRequestFinished);
      chrome.devtools.inspectedWindow.eval(
        'window.location.origin',
        (origin) => {
          const url = `${origin}/graphql`;
          chrome.devtools.inspectedWindow.eval(
            getCodeToFetchGraphql(url, params),
            {},
            function () {}
          );
        }
      );
    });
    return promise.then((value) => value);
  };

const CustomGraphiQLImpl = (props: IProps): JSX.Element => {
  const watchers = React.useRef<Watchers>({});

  return (
    <div style={{ display: 'flex', flex: 1, height: '1100px' }}>
      <GraphiQL
        fetcher={graphQLFetcher(watchers.current)}
        query={props.query}
        variables={props.variables}
      >
        <GraphiQL.Logo>
          <button
            onClick={() => {
              props.onGoBack();
            }}
          >
            {' < Back'}
          </button>
          GraphiQL
        </GraphiQL.Logo>
        <GraphiQL.Toolbar />
      </GraphiQL>
    </div>
  );
};

export const CustomGraphiQL = React.memo(CustomGraphiQLImpl, () => true);
