import {
  assistantControllerCreateConversation,
  assistantControllerGetConversation,
  assistantControllerListConversations,
  assistantControllerUpdateConversationTitle,
} from '@/services/configure/assistant';
import { Conversations } from '@ant-design/x';
import { useRequest } from 'ahooks';
import { GetProp } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  role: 'user' | 'assistant';
}

export const useConversationMessages = (
  conversationId: string | undefined,
  setMessages: any,
) => {
  const { data: conversation } = useRequest(
    async () => {
      if (!conversationId) return [];
      const res = await assistantControllerGetConversation({
        id: conversationId as string,
      });
      return res.data;
    },
    {
      refreshDeps: [conversationId],
    },
  );

  useEffect(() => {
    setMessages(
      _.map(conversation?.messages || [], (item: any) => ({
        ...item,
        message: item.content,
      })),
    );
  }, [conversation, setMessages]);

  return conversation;
};

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

  const { run: renameConversation } = useRequest(
    async (id: string, title: string) => {
      if (!activeConversation) return;
      const res = await assistantControllerUpdateConversationTitle({
        id,
        title,
      });

      return res.data;
    },
    {
      manual: true,
    },
  );

  return {
    renameConversation,
    activeConversation,
    createConversation,
    conversationsItems,
    onConversationClick,
  };
};
