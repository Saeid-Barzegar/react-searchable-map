import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Tooltip } from 'antd';
import { CloseOutlined, LoadingOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './style.css'

const SearchInput = props => {
  
  const {
    value,
    options,
    loading,
    showclose,
    onClearSearch,
    showlist,
    ...otherProps
  } = props;


  return (
    <AutoComplete
      value={value}
      popupMatchSelectWidth={300}
      options={options}
      open={showlist}
      backfill
      notFoundContent={value.length < 3 ? '' : "Not found"}
      {...otherProps}
    >
      <Input
        height={40}
        placeholder={"Search"}
        prefix={<SearchOutlined className='searchIcon' />}
        suffix={showclose
          ? <CloseOutlined className='closeIcon' onClick={onClearSearch}/>
          : (
            loading
              ? <LoadingOutlined className='loadingIcon' />
              : (
                <Tooltip title="Type 3 characters to start search">
                  <InfoCircleOutlined className='infoIcon'/>
                </Tooltip>
              )
            )
        }
      />
    </AutoComplete>
  )
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  showclose: PropTypes.bool,
  onClearSearch: PropTypes.func.isRequired,
  showlist: PropTypes.bool,
}

SearchInput.defaultProps = {
  loading: false,
  showclose: false,
  showlist: false,
};

export default memo(SearchInput);
