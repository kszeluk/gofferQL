import React from 'react';
import QueryItem from './QueryItem';
import style from './QueryItem.css';

const QueryList = (props) => {
  return (
    <div>
      <div className={style.header}>No.</div>
      {props.queries.map((query) => (
        <QueryItem key={query.id} query={query} />
      ))}
    </div>
  );
}

export default QueryList;
