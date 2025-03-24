import { DrawerType } from '@/pages/Home/components/CreateField';
import { fieldControllerRemove } from '@/services/configure/field';
import { ProColumns } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, TableProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export const useColumns = ({ actionRef, modalRef }) => {
  const { runAsync } = useRequest(fieldControllerRemove, {
    manual: true,
  });

  return useMemo<ProColumns<API.Field>[]>(
    () => [
      {
        title: '字段名称',
        dataIndex: 'cnName',
      },
      {
        title: '字段值',
        dataIndex: 'key',
      },
      {
        title: '字段类型',
        hideInSearch: true,
        dataIndex: 'fieldType',
        render: (value) => `${value?.name} (${value.type})`,
      },
      {
        title: '操作',
        hideInSearch: true,
        width: 160,
        dataIndex: 'id',
        render: (value, record) => {
          console.log(record);
          return (
            <>
              <Button
                type="link"
                onClick={() =>
                  modalRef?.current?.open({
                    type: DrawerType.edit,
                    data: record,
                  })
                }
              >
                编辑
              </Button>
              <Popconfirm
                title={`确定删除字段【${record.cnName}】`}
                onConfirm={async () => {
                  await runAsync({ ids: [value] });
                  actionRef.current?.reload?.();
                }}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </>
          );
        },
      },
    ],
    [runAsync, actionRef, modalRef],
  );
};

export const useRowsSelect = ({ actionRef }) => {
  const [rows, setRows] = useState([]);
  const selectedRowKeys = useMemo(() => rows?.map((row) => row.id), [rows]);
  const onChange: TableProps['rowSelection']['onChange'] = useCallback(
    (keys, selectedRows, info) => {
      setRows(selectedRows);
    },
    [],
  );

  const { runAsync } = useRequest(fieldControllerRemove, {
    manual: true,
  });

  const handleDelete = useCallback(async () => {
    const res = await runAsync({ ids: selectedRowKeys });
    if (res.code === 200) {
      actionRef.current?.reload?.();
      setRows([]);
    }
  }, [runAsync, selectedRowKeys, actionRef]);

  return { rowSelection: { selectedRowKeys, onChange }, handleDelete };
};
