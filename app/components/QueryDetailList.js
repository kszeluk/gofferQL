import React from 'react';
import QueryDetailItem from './QueryDetailItem';
import style from './QueryDetailList.css';
import rowStyle from './QueryDetailItem.css';

export const QueryDetailList = (props) => {
  return (
    <div>
      <div className={style.header}>
        <div className={rowStyle.date}>No.</div>
        <div className={rowStyle.size}>Type</div>
        <div className={rowStyle.status}>Status</div>
        <div className={rowStyle.size}>Size</div>
        <div className={rowStyle.query}>Query</div>
        <div className={rowStyle.time}>Time</div>
      </div>
      {props.queries.length > 0 ? props.queries.map((query, index) => (
        <QueryDetailItem
          key={query.id}
          query={query}
          isEven={index % 2 !== 0}
        />
      )) : (
        <div>
          No stored graphql calls, try to refresh the page or do some action on it
        </div>
      )}
    </div>
  );
};
