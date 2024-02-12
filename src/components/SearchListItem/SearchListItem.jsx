import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Row, Typography } from 'antd';
import './styles.css'

const { Text, Title } = Typography;

const SearchListItem = props => {
  const { title, details } = props;
  return (
    <Row className='container'>
      <Title className='title'>{title}</Title>
      {!isEmpty(details) && <Text className='details'>{details}</Text>}
    </Row>
  );
};

SearchListItem.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.string,
}

SearchListItem.defaultProps = {
  details: ''
}

export default SearchListItem;
