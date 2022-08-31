import { Fragment, useState } from 'react'

import { Col, Row, Segmented, Space, Typography } from 'antd'
import Icon from '@ant-design/icons'
import Container from './container'
import Layout from 'components/layout'
import Challenge from './challenge'

import { TabId } from 'constant'
import { ReactComponent as SpinIcon } from 'static/images/icons/spin-icon.svg'
import { ReactComponent as RewardIcon } from 'static/images/icons/reward-icon.svg'
import { ReactComponent as ChallengeIcon } from 'static/images/icons/challenge-icon.svg'

const LUCKY_WHEEL_TABS = [
  {
    label: (
      <Space className="space-middle-icon">
        <Icon style={{ fontSize: 20 }} component={SpinIcon} />
        <Typography.Text>Spin</Typography.Text>
      </Space>
    ),
    value: TabId.Spin,
  },
  {
    label: (
      <Space className="space-middle-icon">
        <Icon style={{ fontSize: 20 }} component={RewardIcon} />
        <Typography.Text>Reward</Typography.Text>
      </Space>
    ),
    value: TabId.Reward,
  },
  {
    label: (
      <Space className="space-middle-icon">
        <Icon style={{ fontSize: 20 }} component={ChallengeIcon} />
        <Typography.Text>Challenge</Typography.Text>
      </Space>
    ),
    value: TabId.Challenge,
  },
]

const Dashboard = () => {
  const [tabId, setTabId] = useState<string>(TabId.Spin)

  return (
    <Fragment>
      <Layout>
        <Row gutter={[64, 64]} style={{ paddingBottom: 24 }}>
          <Col span={24}>
            <Segmented
              value={tabId}
              onChange={(val) => setTabId(val.toString())}
              options={LUCKY_WHEEL_TABS}
              size="large"
            />
          </Col>
          <Col span={24}>
            <Container tabId={tabId} />
          </Col>
        </Row>
      </Layout>
      {tabId === TabId.Challenge && <Challenge />}
    </Fragment>
  )
}

export default Dashboard
