import {
  assistantControllerCreateConversation,
  assistantControllerGetConversation,
  assistantControllerListConversations,
} from '@/services/configure/assistant';
import { Conversations } from '@ant-design/x';
import { useRequest } from 'ahooks';
import { GetProp } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  role: 'user' | 'assistant';
}

export const useConversationMessages = (
  conversationId: string | undefined,
  setMessages: (messages: Message[]) => void,
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

  const messages = useMemo(() => {
    if (!conversation?.messages?.length) return [];
    return conversation.messages
      .map(
        (msg): Message => ({
          ...msg,
          message: msg.content,
        }),
      )
      .sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());
  }, [conversation]);

  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);

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

  return {
    activeConversation,
    createConversation,
    conversationsItems,
    onConversationClick,
  };
};
