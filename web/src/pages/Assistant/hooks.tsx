import {
  assistantControllerAddMessage,
  assistantControllerCreateConversation,
  assistantControllerGetConversation,
  assistantControllerListConversations,
} from '@/services/configure/assistant';
import { Conversations, XStream } from '@ant-design/x';
import { useRequest } from 'ahooks';
import { GetProp } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { assistantControllerStreamResponse } from '../../services/configure/assistant';

export const useConversationMessages = (conversationId: string | undefined,setMessages) => {
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

  const { runAsync: addMessage } = useRequest(async (content: string) => {
    const res = await assistantControllerStreamResponse(
      {
        id: conversationId as string,
      },
      {
        data: { content },
      },
    );

  });

  const messages = useMemo(() => {
    return (conversation?.messages || []).sort((a, b) => {
      return dayjs(a.createdAt).diff(dayjs(b.createdAt));
    });
  }, [conversation]);
  useEffect(() => {
    setMessages(messages);
  }, [messages,setMessages]); // Add messages as a dependency to trigger the effect when messages chang

  return {  addMessage };
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

  return {
    activeConversation,
    createConversation,
    conversationsItems,
    onConversationClick,
  };
};
