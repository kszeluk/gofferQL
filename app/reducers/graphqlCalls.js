import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  calls: [],
  selectedId: null,
  graphiQL: false
};

const actionsMap = {
  [ActionTypes.NEW_GRAPHQL_CALL](state, action) {
    return {
      ...state,
      calls: [
        ...state.calls,
        {
          id: state.calls.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          text: 'New graphql call',
          request: action.request,
          getContent: action.request.getContent.bind(action.request)
        }
      ],
    };
  },
  [ActionTypes.RESET_CALLS](state, action) {
    return {
      calls: [],
      selectedId: null,
      graphiQL: false
    };
  },
  [ActionTypes.SELECT_CALL](state, action) {
    return {
      ...state,
      selectedId: action.selectedId
    };
  },
  [ActionTypes.OPEN_GRAPHIQL](state) {
    return {
      ...state,
      graphiQL: true
    };
  },
  [ActionTypes.CLOSE_GRAPHIQL](state) {
    return {
      ...state,
      graphiQL: false
    };
  }
};

export default function graphqlCalls(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
