import React, { Component } from 'react';
import style from './RequestDetail.css';
import { GraphqlCodeBlock } from 'graphql-syntax-highlighter-react';
import JSONTree from 'react-json-tree';
import { parseData } from '../utils/parseData';
import ClassNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GraphqlCallsActions from '../actions/graphqlCalls';

const getQuery = (query) => {
  const graphqlQuery = JSON.parse(query.request.request.postData.text);

  return graphqlQuery.query;
};

const theme = {
  base00: '#ffffff',
  base01: '#ffffff',
  base02: '#ffffff',
  base03: '#cdcdcd',
  base04: '#881391',
  base05: '#881391',
  base06: '#727272',
  base07: '#212121',
  base08: '#cdcdcd',
  base09: '#0d22aa',
  base0A: '#881391',
  base0B: '#c41a16',
  base0C: '#c41a16',
  base0D: '#881391',
  base0E: '#c41a16',
  base0F: '#c41a16',
};

@connect(
  state => {},
  dispatch => ({
    actions: bindActionCreators(GraphqlCallsActions, dispatch)
  })
)
export default class RequestDetail extends Component {
  state = {
    body: {},
    isLoaded: false,
    selectedTab: 'query'
  };

  componentWillMount() {
    this.props.query.getContent((body) => {
      this.setState(() => ({
        isLoaded: true,
        body
      }));
    });
  }

  componentWillReceiveProps(nextProps) {
    nextProps.query.getContent((body) => {
      this.setState(() => ({
        isLoaded: true,
        body
      }));
    });
  }

  render() {
    const {query} = this.props;
    const data = parseData(this.state.body);

    return (
      <div className={style.wrapper} >
        <div className={style.header}>
          <button
            className={style['clear-selected']}
            onClick={() => this.props.actions.selectCall(null)}
          >
              x
          </button>
          <div
            className={ClassNames(style['header-tab'], { [style.selected]: this.state.selectedTab === 'query' })}
            onClick={() => this.setState(state => ({ ...state, selectedTab: 'query' }))}
          >
            Graphql query
          </div>
          <div
            className={ClassNames(style['header-tab'], { [style.selected]: this.state.selectedTab === 'response' })}
            onClick={() => this.setState(state => ({ ...state, selectedTab: 'response' }))}
          >
            Response
          </div>
          <div className={style.rightHeader}>
            <button
              className={style.buttonGraphql}
              onClick={this.props.actions.openGraphiQL}
            >
              View in GraphiQL
            </button>
          </div>
        </div>
        <div className={style.mainContainer}>
          { this.state.selectedTab === 'query' && (
            <div className={style.query}>
              <GraphqlCodeBlock
                className="GraphqlCodeBlock"
                queryBody={getQuery(query)}
              />
            </div>
          )}
          { this.state.selectedTab === 'response' && (
            <div className={style.response}>
              <JSONTree
                data={data}
                invertTheme={false}
                shouldExpandNode={(name, val, level) => level <= 3}
                theme={theme}
                hideRoot
              />
            </div>
          )}
        </div>
      </div>
    );
  }
};