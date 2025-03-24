import { DrawerType } from '@/pages/Home/components/CreateFieldType';
import { fieldControllerRemoveType } from '@/services/configure/field';
import { ProColumns } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, TableProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export const useColumns = ({ actionRef, modalRef }) => {
  const { runAsync } = useRequest(fieldControllerRemoveType, {
    manual: true,
  });

  return useMemo<ProColumns<API.FieldType>[]>(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },

      {
        title: '额外配置项',
        hideInSearch: true,
        dataIndex: 'options',
      },
      {
        title: '修改时间',
        width: 180,
        hideInSearch: true,
        dataIndex: 'updatedAt',
        render: (value: string) => {
          return new Date(value).toLocaleString();
        },
      },
      {
        title: '操作',
        hideInSearch: true,
        width: 160,
        dataIndex: 'id',
        render: (value, record) => {
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
                title={`确定删除字段类型【${record.name}】`}
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

  const { runAsync } = useRequest(fieldControllerRemoveType, {
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
