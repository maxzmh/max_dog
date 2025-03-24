import PProTable from '@/components/PProTable';
import CreateFieldType, {
  DrawerType,
  refType,
} from '@/pages/Home/components/CreateFieldType';
import { fieldControllerFindTypes } from '@/services/configure/field';
import { ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, Space } from 'antd';
import { useRef } from 'react';
import { useColumns, useRowsSelect } from './hooks';

export default function FieldType() {
  const modalRef = useRef<refType | undefined>();
  const actionRef = useRef<ActionType | undefined>();
  const columns = useColumns({ actionRef, modalRef });
  const { rowSelection, handleDelete } = useRowsSelect({ actionRef });

  return (
    <>
      <PProTable
        pagination={
          {
            defaultPageSize: 10,
            showQuickJumper: true,
          } as any
        }
        actionRef={actionRef}
        rowSelection={rowSelection}
        toolBarRender={() =>
          (
            <Space>
              <Popconfirm
                title="确定删除所选择字段类型？"
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
        request={fieldControllerFindTypes}
        rowKey="id"
      />
      <CreateFieldType
        ref={modalRef}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </>
  );
}
