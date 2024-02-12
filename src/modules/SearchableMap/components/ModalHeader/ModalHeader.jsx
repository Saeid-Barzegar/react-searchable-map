import React from 'react'
import PropTypes from "prop-types";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Typography } from "antd";
import "./styles.css";

const { Title } = Typography;

const ModalHeader = ({title}) => {
  return (
    <Row>
      <InfoCircleOutlined className="modal-header-icon" />
      <Title className="modal-header-title" >{title}</Title>
    </Row>
  )
}

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

ModalHeader.defautProps = {
  title: "",
}

export default ModalHeader;
