import { ClusterOutlined, ContactsOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { Link, useRequest, useModel } from 'umi';
import styles from './Center.less';
import Applications from './components/Applications';
import Articles from './components/Articles';
import Projects from './components/Projects';
import { queryCurrent, queryReservations, queryRecords, queryBills } from './service';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';

const operationTabList = [
  {
    key: 'reservations',
    tab: (
      <span>
        预约记录{' '}
      </span>
    ),
  },
  {
    key: 'records',
    tab: (
      <span>
        病历{' '}
      </span>
    ),
  },
  {
    key: 'bills',
    tab: (
      <span>
        账单{' '}
      </span>
    ),
  },
];

const TagList = ({ tags }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showInput = () => {
    setInputVisible(true);

    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];

    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [
        ...tempsTags,
        {
          key: `new-${tempsTags.length}`,
          label: inputValue,
        },
      ];
    }

    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>标签</div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{
            borderStyle: 'dashed',
          }}
        >
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center = () => {
  const [tabKey, setTabKey] = useState('reservations');
  const [userData, setUserData] = useState({});

  const { data: currentUser, loading } = useRequest(() => {
      return queryCurrentUser();
    },
    {
      pollingInterval: 1000 * 1000,
      onSuccess: async (data, params) => {
        const patient_id = data.id;
        setUserData({
          reservations: (await queryReservations({ patient_id })).data,
          records: (await queryRecords({ patient_id })).data,
          bills: (await queryBills({ patient_id })).data,
        });
      }
    }
  );

  const renderUserInfo = ({ geographic }) => {
    return (
      <div className={styles.detail}>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          { geographic.province || '' } 
          { geographic.city || '' }
          { geographic.address || '' }
        </p>
      </div>
    );
  };

  const renderChildrenByTabKey = (tabValue) => {

    if (tabValue === 'reservations') { //预约记录
      return <Articles data={userData.reservations}/>;
    }

    if (tabValue === 'records') { //过往病历
      return <Applications data={userData.records}/>;
    }

    if (tabValue === 'bills') { //账单
      return <Projects data={userData.bills}/>;
    }

    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={6} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={loading}
          >
            {!loading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.name}</div>
                  <div>{currentUser?.signature}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <TagList tags={currentUser.tags || []} />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
              </div>
            )}
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(_tabKey) => {
              setTabKey(_tabKey);
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Center;
