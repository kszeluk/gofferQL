import React, { Component, PropTypes } from 'react';
import GraphiQL from 'graphiql';
import uuid from 'uuid';
import style from './CustomGraphiQL.css';

export const SPECIAL_HEADER = '__graphiql-tool-id';

const getCodeToFetchGraphql = (url, params) => `(function(){ return fetch("${url}", ${JSON.stringify(params)})})()`;

export default class CustomGraphiQL extends Component {
  watchers = {};

  graphQLFetcher = (graphQLParams) => {
    const id = uuid();
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [SPECIAL_HEADER]: id
      },
      body: JSON.stringify(graphQLParams),
    };
    const _this = this;

    const promise = new Promise(
      function(resolve) {
        const onRequestFinished = (request) => {
          const isThisRequest = request.request.headers.some(
            header => header.name === SPECIAL_HEADER && header.value === id
          );
          if (isThisRequest) {
            chrome.devtools.network.onRequestFinished.removeListener(_this.watchers[id]);
            request.getContent(content => {
              resolve(JSON.parse(content));
            });
          }
        };
        _this.watchers[id] = onRequestFinished;
        chrome.devtools.network.onRequestFinished.addListener(onRequestFinished);
        chrome.devtools.inspectedWindow.eval('window.location.origin', (origin) => {
          const url = `${origin}/graphql`;
          chrome.devtools.inspectedWindow.eval(
            getCodeToFetchGraphql(url, params), {}, function () {}
          );
        });
      }
    );
    return promise.then(value => value);
  };

  shouldComponentUpdate(prevProps) {
    if (prevProps.query !== this.props.query || prevProps.variables !== this.props.variables) {
      return true;
    }

    return false;
  }

  render() {
    console.log('rerender');
    return (
      <div style={{display: 'flex', flex: 1, height: '1100px' }}>
        <GraphiQL
          fetcher={this.graphQLFetcher}
          query={this.props.query}
          variables={this.props.variables}
        >
          <GraphiQL.Logo>
            <button className={style.backButton} onClick={() => { console.log('dupa'); this.props.onGoBack(); }}>
              {' < Back'}
            </button>
            GraphiQL
          </GraphiQL.Logo>
          <GraphiQL.Toolbar />
        </GraphiQL>
      </div>
    );
  }
}
