import React, { Component, PropTypes } from 'react';
import style from './MainSection.css';
import QueryList from './QueryList';
import RequestDetail from './RequestDetail';
import { parse, print } from 'graphql';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GraphqlCallsActions from '../actions/graphqlCalls';
import CustomGraphiQL from './CustomGraphiQL';
import { QueryDetailList } from './QueryDetailList';

const getSelectedCall = (props) => {
  if (props.selectedId !== null) {
    return props.graphqlCalls.find((call) => call.id === props.selectedId);
  }

  return props.graphqlCalls[0];
};

@connect(
  state => {},
  dispatch => ({
    actions: bindActionCreators(GraphqlCallsActions, dispatch)
  })
)
export default class MainSection extends Component {
  static propTypes = {
    graphqlCalls: PropTypes.array.isRequired,
    selectedId: PropTypes.Number
  };

  render() {
    const { graphqlCalls } = this.props;
    const selectedCall = getSelectedCall(this.props);
    const isCallSelected = this.props.selectedId != null;

    if (this.props.openedGraphiQL && selectedCall.request.request.postData) {
      const { query, variables } = JSON.parse(selectedCall.request.request.postData.text);
      return (
        <CustomGraphiQL
          query={print(parse(query))}
          variables={JSON.stringify(variables)}
          onGoBack={() => { this.props.actions.closeGraphiQL(); }}
        />
      );
    }

    if (!isCallSelected) {
      return (
        <QueryDetailList
          queries={graphqlCalls}
        />
      );
    }

    return (
      <section className={style.main}>
        <section className={style.leftPanel}>
          <QueryList
            queries={graphqlCalls}
          />
        </section>
        <section className={style.rightPanel}>
          <RequestDetail
            query={getSelectedCall(this.props)}
          />
        </section>
      </section>
    );
  }
}
