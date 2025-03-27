import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Attachments,
  Bubble,
  BubbleProps,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import { useLatest } from 'ahooks';
import {
  Avatar,
  Badge,
  Button,
  type GetProp,
  Input,
  Space,
  Typography,
} from 'antd';
import markdownit from 'markdown-it';
import React, { useRef } from 'react';
import { useConversationMessages, useConversations } from './hooks';
import styles from './index.less';

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(
      <FireOutlined style={{ color: '#FF4D4F' }} />,
      '热门话题',
    ),
    description: '你对什么感兴趣？',
    children: [
      {
        key: '1-1',
        description: 'X 有什么新功能？',
      },
      {
        key: '1-2',
        description: '什么是 AGI？',
      },
      {
        key: '1-3',
        description: '在哪里可以找到文档？',
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(
      <ReadOutlined style={{ color: '#1890FF' }} />,
      '设计指南',
    ),
    description: '如何设计一个好的产品？',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: '了解产品',
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: '设置 AI 角色',
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: '表达感受',
      },
    ],
  },
];

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '热门话题',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
  },
  {
    key: '2',
    description: '设计指南',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
  },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  assistant: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    avatar: {
      icon: (
        <Avatar src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original" />
      ),
      style: { background: '#fff' },
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  user: {
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
    placement: 'end',
    variant: 'shadow',
  },
};

const Independent: React.FC = () => {
  const {
    activeConversation,
    createConversation,
    conversationsItems,
    onConversationClick,
  } = useConversations();

  const conversationRef = useLatest(activeConversation);
  const abortRef = useRef(() => {});

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, 'items'>
  >([]);

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      if (!conversationRef.current) {
        return;
      }

      const response = await fetch(
        `/api/assistant/conversations/${conversationRef.current}/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message,
          }),
        },
      );
      abortRef.current = () => {
        reader?.cancel();
      };

      const reader = response.body?.getReader();
      if (!reader) return;
      let full = '';
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (!value) continue;
        const chunkValue = decoder.decode(value);
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            if (content.trim()) {
              full += JSON.parse(content).content;
              onUpdate(full);
            }
          }
        }
      }

      onSuccess(full);
    },
  });

  const { setMessages, messages, onRequest } = useXChat({ agent });

  const conversation = useConversationMessages(activeConversation, setMessages);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好，我是 Max Dog"
        description="基于 Ant Design 的 AGI 产品界面解决方案，创造更好的智能愿景~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="你想要什么？"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map((item) => {
    const { id, message, status, content, role } = item as any;
    return {
      ...item,
      content: message || content,
      typing: false,
      key: id,
      messageRender: renderMarkdown,
      role: role ? role : status === 'local' ? 'user' : 'assistant',
    };
  });

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: '将文件拖放到此处' }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '点击或将文件拖拽到此区域上传',
              }
        }
      />
    </Sender.Header>
  );

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Max Dog</span>
    </div>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={createConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          新对话
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeConversation}
          onActiveChange={onConversationClick}
        />
      </div>
      <div style={{ width: '100%' }}>
        <div className={styles.conversationName}>
          <div>
            <Input
              className={styles.title}
              size="large"
              value={conversation?.title}
              variant="filled"
            />
          </div>
          <div className={styles.mark}></div>
        </div>

        <div className={styles.chat}>
          {/* 🌟 消息列表 */}
          <div
            style={{
              flex: 1,
              overflowY: 'scroll',
              width: '100%',
              borderRadius: 4,
            }}
          >
            <Bubble.List
              items={
                items.length > 0
                  ? items
                  : [{ content: placeholderNode, variant: 'borderless' }]
              }
              roles={roles}
              className={styles.messages}
            />
          </div>
          {/* 🌟 提示词 */}
          <Prompts
            className={styles.prompts}
            items={senderPromptsItems}
            onItemClick={onPromptsItemClick}
          />
          {/* 🌟 输入框 */}
          <Sender
            value={content}
            header={senderHeader}
            onSubmit={onSubmit}
            onChange={setContent}
            prefix={attachmentsNode}
            loading={agent.isRequesting()}
            className={styles.sender}
            onCancel={() => abortRef.current()}
          />
        </div>
      </div>
    </div>
  );
};

export default Independent;
