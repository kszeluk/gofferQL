const formatString = (num) => {
  return String(num).length === 1 ? ('0' + String(num)) : String(num);
};

export const getLocalDateFormat = (dateString) => {
  const date = new Date(dateString);
  const hour = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();

  return `${formatString(hour)}:${formatString(mins)}:${formatString(secs)}`;
};

const getQueryPrefix = (query) => {
  const queryJSON = JSON.parse(query);
  const queryWithArgs = queryJSON.query.split('{')[0];

  return queryWithArgs.split('(')[0];
};

export const getQueryName = (query) => {
  return getQueryPrefix(query).split(' ')[1];
};

export const getQueryType = (query) => {
  return getQueryPrefix(query).split(' ')[0];
};
