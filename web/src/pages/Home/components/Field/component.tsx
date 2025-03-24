import PProTable from '@/components/PProTable';
import CreateField, {
  DrawerType,
  refType,
} from '@/pages/Home/components/CreateField';
import { fieldControllerFindAll } from '@/services/configure/field';
import { ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { useColumns, useRowsSelect } from './hooks';

export default function Field() {
  const modalRef = useRef<refType | undefined>();
  const actionRef = useRef<ActionType | undefined>();
  const columns = useColumns({ actionRef, modalRef });
  const { rowSelection, handleDelete } = useRowsSelect({ actionRef });

  const [colStates, setColStates] = useState({
    cnName: { show: true, fixed: 'right', order: 0 },
    key: { show: true, order: 1 },
    options: { show: true, order: 2 },
    id: { show: true, order: 3 },
  });

  return (
    <>
      <PProTable
        pagination={
          {
            defaultPageSize: 10,
            showQuickJumper: true,
          } as any
        }
        columnsState={
          {
            value: colStates,
            onChange: (value) => {
              setColStates(value);
            },
            persistenceKey: 'persisi',
            persistenceType: 'localStorage',
          } as any
        }
        actionRef={actionRef}
        rowSelection={rowSelection}
        toolBarRender={() =>
          (
            <Space>
              <Popconfirm
                title="确定删除所选择字段？"
                onConfirm={handleDelete}
                disabled={!rowSelection.selectedRowKeys.length}
              >
                <Button disabled={!rowSelection.selectedRowKeys.length}>
                  批量删除
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() =>
                  modalRef.current?.open?.({
                    type: DrawerType.create,
                    data: {},
                  })
                }
              >
                新建
              </Button>
            </Space>
          ) as any
        }
        columns={columns}
        request={fieldControllerFindAll}
        rowKey="id"
      />
      <CreateField
        ref={modalRef}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </>
  );
}
