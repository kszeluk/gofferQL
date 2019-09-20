import React, { Component } from 'react';
import style from './QueryDetailItem.css';
import ClassNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GraphqlCallsActions from '../actions/graphqlCalls';
import { getLocalDateFormat, getQueryName, getQueryType } from "../utils/queryUtils";

@connect(
  state => {},
  dispatch => ({
    actions: bindActionCreators(GraphqlCallsActions, dispatch)
  })
)
export default class QueryDetailItem extends Component {
  render() {
    const { request } = this.props.query;
    const queryName = getQueryName(request.request.postData.text);

    return (
      <div
        className={ClassNames(style.wrapper, {[style.even]: this.props.isEven})}
        onClick={() => this.props.actions.selectCall(this.props.query.id)}
      >
        <div className={style.date}>
          <div className={style.dateText}>
            {`${this.props.query.id}. ${getLocalDateFormat(request.startedDateTime)}`}
          </div>
          <span
            className={style.queryName}
            title={queryName}
          >
            {queryName}
          </span>
        </div>
        <div className={style.size}>
          {getQueryType(request.request.postData.text)}
        </div>
        <div className={style.status}>
          {request.response.status}
        </div>
        <div className={style.size}>
          {`${request.response._transferSize} B`}
        </div>
        <div
          className={style.query}
          title={request.request.postData.text}
        >
          {request.request.postData.text}
        </div>
        <div className={style.time}>
          {`${request.time.toFixed()} ms`}
        </div>
      </div>
    );
  }
}
