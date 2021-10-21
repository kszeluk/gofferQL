import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';
import * as GraphqlCallsActions from '../actions/graphqlCalls';
import style from './App.css';
import CustomGraphiQL from '../components/CustomGraphiQL';

function filterGraphqlCalls(calls, query) {
  if (!query) {
    return calls;
  }

  return calls.filter((call) => {
    return call.request.request.postData.text.indexOf(query) > -1;
  });
}

@connect(
  state => ({
    graphqlCalls: state.graphqlCalls.calls,
    selectedCall: state.graphqlCalls.selectedId,
    openedGraphiQL: state.graphqlCalls.graphiQL
  }),
  dispatch => ({
    actions: bindActionCreators(GraphqlCallsActions, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    graphqlCalls: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  state = {
    graphiQL: false,
    filteringText: ''
  }

  handleChange(event) {
    this.setState({ filteringText: event.target.value });
  }

  render() {
    const { graphqlCalls, actions, selectedCall, openedGraphiQL } = this.props;

    if (this.state.graphiQL) {
      return (
        <CustomGraphiQL
          query=""
          variables=""
          onGoBack={() => {
            this.setState(() => ({
              graphiQL: false
            }));
          }}
        />
      );
    }

    return (
      <div className={style.normal}>
        <div className={style.header}>
          <button
            className={style.buttonGraphql}
            onClick={() => {
              this.setState(() => ({
                graphiQL: true
              }));
            }}
          >
            GraphiQL
          </button>
          <button
            className={style.buttonGraphql}
            onClick={this.props.actions.resetCalls}
          >
            Clear
          </button>
          <input
            className={style.filterInput}
            type="text"
            placeholder="Filter"
            value={this.state.filteringText}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <MainSection
          graphqlCalls={filterGraphqlCalls(graphqlCalls, this.state.filteringText)}
          actions={actions}
          selectedId={selectedCall}
          openedGraphiQL={openedGraphiQL}
        />
      </div>
    );
  }
}
