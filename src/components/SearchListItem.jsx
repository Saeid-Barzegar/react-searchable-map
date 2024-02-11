import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

const SearchListItem = props => {
  const { title, details } = props;
  return (
    <div style={styles.container}>
      <b style={styles.title}>{title}</b>
      {!isEmpty(details) && <span style={styles.details}>{details}</span>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
  },
  details: {
    fontSize: 12,
  }
}

SearchListItem.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.string,
}

SearchListItem.defaultProps = {
  details: ''
}

export default SearchListItem;
