import { Select, SelectProps } from 'antd';
import React from 'react';

const TrimTagSelect: React.FC<SelectProps> = (props) => {
  const { onChange } = props;

  const handleChange = (_value: any, options: any) => {
    let values = Array.isArray(_value) ? _value : [_value];
    values = values.map((value) => {
      return value.trim ? value.trim() : value;
    });
    onChange?.(values, options);
  };

  return <Select {...props} mode="tags" onChange={handleChange} />;
};

export default TrimTagSelect;
