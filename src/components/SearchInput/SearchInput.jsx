import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider, Input, AutoComplete, Tooltip } from 'antd';
import { CloseOutlined, LoadingOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
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

  const notFound = useMemo(() => showlist && (isEmpty(value) ? '' : "No result"), [showlist]);
  
  return (
    <ConfigProvider theme={{
      components: {
        AutoComplete: {
          background: 'orange',
          width: 300,
          marginTop: 20,
          marginLeft: 20,
          zIndex: 999,
        }
      }
    }}>
      <AutoComplete
        value={value}
        popupMatchSelectWidth={300}
        options={options}
        open={showlist}
        backfill
        notFoundContent={notFound}
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
    </ConfigProvider>
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
