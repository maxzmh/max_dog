import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import { Button, Col, Flex, Row } from 'antd';
import { useConversations } from './hooks';
import styles from './index.less';

const HomePage: React.FC = () => {
  const {
    activeConversation,
    onConversationClick,
    createConversation,
    conversationsItems,
  } = useConversations();

  return (
    <div className={styles.container}>
      <PageContainer>
        <Row gutter={12} style={{ height: 'calc(100vh - 120px)' }}>
          <Col span={6} className={styles.menu}>
            <div style={{ height: 72 }}></div>
            <Button
              style={{ width: '100%' }}
              onClick={createConversation}
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
          </Col>
          <Col span={18}>
            <Flex vertical style={{ height: '100%' }}>
              <Bubble.List style={{ flex: 1 }} />
              <Sender style={{ marginBottom: 24 }} />
            </Flex>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

export default HomePage;
