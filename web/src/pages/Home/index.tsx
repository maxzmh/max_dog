import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import Field from './components/Field';
import FieldConfig from './components/FieldConfig';
import FieldType from './components/FieldType';
import styles from './index.less';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '字段类型',
    children: <FieldType />,
  },
  {
    key: '2',
    label: '字段',
    children: <Field />,
  },
  {
    key: '3',
    label: '字段配置',
    children: <FieldConfig />,
  },
];

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <PageContainer>
        <Tabs defaultActiveKey="1" items={items} />
      </PageContainer>
    </div>
  );
};

export default HomePage;
