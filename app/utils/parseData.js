export const parseData = (value) => { 
  if (typeof value === 'object') {
    const data = { ...value };

    Object.keys(data).forEach((key) => {
      data[key] = parseData(data[key]);
    });

    return data;
  }

  try {
    const data = JSON.parse(value);

    return parseData(data);
  } catch (e) {
    return value;
  }
};
