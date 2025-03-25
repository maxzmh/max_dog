import {
  assistantControllerCreateConversation,
  assistantControllerListConversations,
} from '@/services/configure/assistant';
import { Conversations } from '@ant-design/x';
import { useRequest } from 'ahooks';
import { GetProp } from 'antd';
import { useState } from 'react';

export const useConversations = () => {
  const [activeConversation, setActiveKey] = useState<string>();
  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (
    key,
  ) => {
    setActiveKey(key);
  };
  const { data: conversationsItems, refresh: refreshConversations } =
    useRequest(async () => {
      const response = await assistantControllerListConversations();
      return response.data.map((item: any) => {
        return {
          ...item,
          label: item.title,
          key: item.id,
        };
      });
    });

  const { run: createConversation } = useRequest(
    async () => {
      const res = await assistantControllerCreateConversation({
        data: { title: 'max' + Math.random() },
      });
      onConversationClick(res.data.id);
      refreshConversations();
    },
    { manual: true },
  );

  return {
    activeConversation,
    createConversation,
    conversationsItems,
    onConversationClick,
  };
};
