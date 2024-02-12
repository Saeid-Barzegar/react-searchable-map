import React from 'react';
import { Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './styles.css';

const FallBack = () => {
  return (
    <Col span={24} className='fallback-container'>
      <LoadingOutlined width={70} height={70} className='loading' />
    </Col>
  )
}

export default FallBack;
