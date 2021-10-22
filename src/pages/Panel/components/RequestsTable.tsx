import React from 'react';
import { Table } from './Table';

import { getQueryName, getLocalDateFormat } from '../../../utils/queryUtils';
import { Column, CellProps } from 'react-table';
import { DetailRequestPage } from './DetailRequestPage';

interface IProps {
  graphqlCalls: {
    request: chrome.devtools.network.Request;
  }[];
}

type Data = {
  id: string;
  name: string;
  date: string;
  status: number;
  query: string;
  time: string;
  responseSize: string;
} & object;

type DataDetail = {
  request: {
    id: string;
    name: string;
    date: string;
  };
};

const OneColumnCell = (
  props: CellProps<object, DataDetail['request']>
): JSX.Element => {
  return (
    <>
      <span>
        {props.value.id} {props.value.date}
      </span>
      <span>{props.value.name}</span>
    </>
  );
};

const DETAIL_COLUMNS: Column<DataDetail>[] = [
  {
    Header: 'Request',
    accessor: 'request',
    Cell: OneColumnCell,
  },
];

const COLUMNS: Column<Data>[] = [
  {
    Header: 'Idx',
    accessor: 'id',
  },
  {
    Header: 'Query Name',
    accessor: 'name',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Date',
    accessor: 'date',
  },
  {
    Header: 'Time',
    accessor: 'time',
  },
  {
    Header: 'Response size',
    accessor: 'responseSize',
  },
  {
    Header: 'Query',
    accessor: 'query',
  },
];

export const RequestsTable = (props: IProps): JSX.Element => {
  const [rowSelected, setSelectedRow] = React.useState<string | null>(null);

  const data: Data[] = props.graphqlCalls.map((call, id) => {
    return {
      id: String(id),
      name: getQueryName(call.request.request.postData!.text!),
      date: getLocalDateFormat(call.request.startedDateTime),
      status: call.request.response.status,
      query:
        (
          JSON.parse(call.request.request.postData!.text!).query as string
        ).substring(0, 100) + '...',
      time: `${call.request.time.toFixed()} ms`,
      responseSize: `${call.request.response._transferSize} B`,
    };
  });

  const detailedData: DataDetail[] = props.graphqlCalls.map((call, id) => {
    return {
      request: {
        id: String(id),
        name: getQueryName(call.request.request.postData!.text!),
        date: getLocalDateFormat(call.request.startedDateTime),
      },
    };
  });

  if (rowSelected !== null) {
    return (
      <div>
        <button onClick={() => setSelectedRow(null)}>Deselect</button>
        <Table<DataDetail>
          data={detailedData}
          columns={DETAIL_COLUMNS}
          onRowSelected={(rowId) => {
            setSelectedRow(rowId);
          }}
        />
        <DetailRequestPage
          request={props.graphqlCalls[Number(rowSelected)].request}
        />
      </div>
    );
  }

  return (
    <Table<Data>
      data={data}
      columns={COLUMNS}
      onRowSelected={(rowId) => {
        setSelectedRow(rowId);
      }}
    />
  );
};
