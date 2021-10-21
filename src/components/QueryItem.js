import React, { Component } from 'react';
import ClassNames from 'classnames';
import style from './QueryItem.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as GraphqlCallsActions from '../actions/graphqlCalls';
import { getLocalDateFormat, getQueryName } from "../utils/queryUtils";

@connect(
  state => ({
    selectedCall: state.graphqlCalls.selectedId
  }),
  dispatch => ({
    actions: bindActionCreators(GraphqlCallsActions, dispatch)
  })
)
export default class QueryItem extends Component {
  render() {
    const {query} = this.props;
    const queryName = getQueryName(query.request.request.postData.text);

    return (
      <div
        className={ClassNames(style.wrapper, {[style.selected]: this.props.selectedCall === query.id})}
        onClick={() => this.props.actions.selectCall(query.id)}
      >
        <div className={style.dateText}>
          {`${query.id}. ${getLocalDateFormat(query.request.startedDateTime)}`}
        </div>
        <span
          className={style.queryName}
          title={queryName}
        >
          {queryName}
        </span>
      </div>
    );
  }
}
