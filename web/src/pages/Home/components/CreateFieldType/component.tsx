import TrimInput from '@/components/Trim/TrimInput';
import {
  fieldControllerCreateType,
  fieldControllerUpdateType,
} from '@/services/configure/field';
import { isNil } from '@/utils/format';
import { useRequest } from 'ahooks';
import { Form, message, Modal } from 'antd';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export enum DrawerType {
  create = '新建字段类型',
  edit = '编辑字段类型',
}

export type payloadType = { type: DrawerType; data: Record<string, any> };

export type refType = {
  close: () => void;
  open: (payload: payloadType) => void;
};

const defaultPayLoad = {
  type: DrawerType.create,
  data: {},
};
type Validator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void,
) => Promise<void | any> | void;

function isJSONString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export const jsonStringValidator: Validator = (rule, value, callback) => {
  if (value !== '' && !isNil(value) && !isJSONString(value)) {
    callback('请输入合法的JSON字符串');
  } else {
    callback();
  }
};

export default forwardRef<refType, any>((props, ref) => {
  const { onSuccess } = props;
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<payloadType>(defaultPayLoad);
  const [form] = Form.useForm();
  const { loading, runAsync } = useRequest(
    payload.type === DrawerType.create
      ? fieldControllerCreateType
      : fieldControllerUpdateType,
    {
      manual: true,
    },
  );

  const handleOpen = useCallback(
    (payload: payloadType) => {
      if (payload.type === DrawerType.edit) {
        form.setFieldsValue(payload?.data || {});
      }
      setPayload(payload);
      setOpen(true);
    },
    [setPayload, setOpen, form],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
    setPayload(defaultPayLoad);
  }, [form, setPayload, setOpen]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();
    let res;
    if (!isNil(values?.id)) {
      // 编辑
      res = await runAsync({ id: values.id }, values);
    } else {
      // 新建
      res = await runAsync(values);
    }
    if (res.code === 200) {
      onSuccess?.();
      message.success('操作成功');
      handleClose();
    } else {
      message.error(res?.message ?? '操作失败');
    }
  }, [onSuccess, handleClose, runAsync, form]);

  useImperativeHandle(
    ref,
    (): refType => ({
      open: handleOpen,
      close: handleClose,
    }),
  );

  return (
    <Modal
      title={payload.type}
      width={600}
      open={open}
      onCancel={handleClose}
      onOk={handleSave}
      okButtonProps={{ loading }}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 4 }}>
        <Form.Item label="ID" name="id" hidden>
          <TrimInput />
        </Form.Item>
        <Form.Item label="字段名称" name="name" rules={[{ required: true }]}>
          <TrimInput />
        </Form.Item>
        <Form.Item label="字段值" name="type" rules={[{ required: true }]}>
          <TrimInput />
        </Form.Item>
        <Form.Item
          label="附加项"
          name="options"
          rules={[{ validator: jsonStringValidator }]}
        >
          <TrimInput.TextArea
            autoSize={{ minRows: 6, maxRows: 12 }}
            onBlur={(e) => {
              const value = e.target.value;
              try {
                e.target.value = JSON.stringify(JSON.parse(value), null, 2);
              } catch (e) {
                console.log('非法的JSON字符串');
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
