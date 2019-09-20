import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import * as types from '../../app/constants/ActionTypes';
import { SPECIAL_HEADER } from '../../app/components/CustomGraphiQL';
import './graphql.css';

function onRequestFinished(store) {
  return (request) => {
    const sendFromGraphiQL = request.request.headers.some(header => header.name === SPECIAL_HEADER);

    if (request.request.url.endsWith('graphql') && !sendFromGraphiQL) {
      store.dispatch(
        { type: types.NEW_GRAPHQL_CALL, request, content: request.getContent.bind(request) }
      );
    }
  };
}

function onNavigated(store) {
  return () => {
    store.dispatch({ type: types.RESET_CALLS });
  };
}

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');

  const store = createStore(initialState);

  chrome.devtools.network.onRequestFinished.addListener(onRequestFinished(store));
  chrome.devtools.network.onNavigated.addListener(onNavigated(store));

  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
});

chrome.devtools.panels.create(
  'GraphDevQL',
  '',
  'devtools.html',
  () => {}
);
