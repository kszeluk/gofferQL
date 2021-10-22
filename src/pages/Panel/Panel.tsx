import React from 'react';
import { CustomGraphiQL, SPECIAL_HEADER } from './components/CustomGraphiQL';
import { RequestsTable } from './components/RequestsTable';

enum Mode {
  Table,
  PlayGround,
}

export const Panel = () => {
  const [graphqlCalls, setGraphqlCalls] = React.useState<any[]>([]);
  const graphqlCallValue = React.useRef<any>([]);
  const [mode, setMode] = React.useState<Mode>(Mode.Table);

  const onRequestFinished = (request: chrome.devtools.network.Request) => {
    const sendFromGraphiQL = request.request.headers.some(
      (header) => header.name === SPECIAL_HEADER
    );

    if (request.request.url.endsWith('graphql') && !sendFromGraphiQL) {
      graphqlCallValue.current = [
        ...graphqlCallValue.current,
        { request, content: request.getContent.bind(request) },
      ];
      setGraphqlCalls(graphqlCallValue.current);
    }
  };

  function onNavigated() {
    graphqlCallValue.current = [];
    setGraphqlCalls([]);
  }

  React.useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener(onRequestFinished);
    chrome.devtools.network.onNavigated.addListener(onNavigated);
  }, []);

  return (
    <>
      <button onClick={() => setMode(Mode.Table)}>Requests</button>
      <button onClick={() => setMode(Mode.PlayGround)}>Playground</button>
      {mode === Mode.Table && <RequestsTable graphqlCalls={graphqlCalls} />}
      {mode === Mode.PlayGround && (
        <CustomGraphiQL query="" variables="" onGoBack={() => {}} />
      )}
    </>
  );
};
