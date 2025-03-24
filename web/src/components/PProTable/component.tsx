import { ProTable, ProTableProps } from '@ant-design/pro-components';
import React from 'react';

const PProTable: React.FC<
  ProTableProps<Record<string, any>, Record<string, any>, 'text'>
> = (props) => {
  const { request, ...restProps } = props;

  const handleRequest = async (params, ...rest) => {
    const { current, pageSize } = params;
    delete params.current;
    delete params.pageSize;
    const _params = { ...params, page: current, limit: pageSize };
    const res = await request(_params, ...rest);
    return (
      res?.data || {
        data: [],
        total: 0,
      }
    );
  };
  return React.cloneElement(<ProTable />, {
    ...restProps,
    request: handleRequest,
  } as any);
};

export default PProTable;
