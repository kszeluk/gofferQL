import * as types from '../constants/ActionTypes';

export function newGraphqlCall(request) {
  return { type: types.NEW_GRAPHQL_CALL, request, content: request.getContent.bind(request) };
}

export function resetCalls() {
  return { type: types.RESET_CALLS };
}

export function selectCall(callId) {
  return { type: types.SELECT_CALL, selectedId: callId };
}

export function openGraphiQL() {
  return { type: types.OPEN_GRAPHIQL };
}

export function closeGraphiQL() {
  return { type: types.CLOSE_GRAPHIQL };
}
