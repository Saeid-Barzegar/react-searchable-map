import React from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete } from 'antd';
import { CloseOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';

const SearchBox = (props) => {

  const {
    value,
    listData,
    isLoading,
    shwoClose,
    onSearch,
    onSelect,
    onClearSearch,
  } = props;

  return (
    <AutoComplete
      value={value}
      style={styles.autoComplete}
      popupMatchSelectWidth={300}
      onSelect={onSelect}
      options={listData}
      onSearch={onSearch}
    >
      <Input
        style={styles.input}
        height={40}
        placeholder="Search"
        prefix={<SearchOutlined style={styles.searchIcon} />}
        suffix={shwoClose
          ? <CloseOutlined style={styles.closeIcon} onClick={onClearSearch}/>
          : (isLoading && <LoadingOutlined style={styles.loadingIcon} />)
        }
      />
    </AutoComplete>
  )
};

const styles = {
  autoComplete: {
    width: 300,
    marginTop: 20,
    marginLeft: 20,
    zIndex: 999,
  },
  input: {
    width: 300,
    fontSize: 18,
    color: '#3e3e3e',
    boxShadow: '2px 2px 9px 0px rgb(192 190 190)'
  },
  searchIcon: {
    fontSize: 20,
    padding: 5,
    color: 'gray',
  },
  closeIcon: {
    color: 'gray',
    fontSize: 14,
  },
  loadingIcon: {
    color: 'gray',
  }
};

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  listData: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  shwoClose: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired
}

SearchBox.defaultProps = {
  isLoading: false,
  shwoClose: false,
};

export default SearchBox;
