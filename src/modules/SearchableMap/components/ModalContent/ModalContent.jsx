import React from 'react'
import PropTypes from "prop-types";
import { Col, Typography } from "antd";
import "./styles.css";

const { Title, Text } = Typography;

const ModalContent = ({name, address}) => {
  return (
    <Col className="modal-content-container" >
      <Title className="modal-content-title" >{name}</Title>
      {address && <Text><b>Address: </b>{address}</Text>}
    </Col>
  );
}

ModalContent.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
}

ModalContent.defautProps = {
  name: "",
  address: "",
}

export default ModalContent;
