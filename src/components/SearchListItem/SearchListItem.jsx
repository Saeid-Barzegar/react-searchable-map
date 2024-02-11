import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import './styles.css'

const SearchListItem = props => {
  const { title, details } = props;
  return (
    <div className='container'>
      <b className='title'>{title}</b>
      {!isEmpty(details) && <span className='details'>{details}</span>}
    </div>
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
