import React from 'react';

interface IProps {
  request: chrome.devtools.network.Request;
}

export const DetailRequestPage = (props: IProps): JSX.Element => {
  const [content, setContent] = React.useState('');
  props.request.getContent((content) => setContent(content));

  return <div>{content}</div>;
};
