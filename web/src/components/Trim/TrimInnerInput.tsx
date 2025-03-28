/**
 * InnerInput
 * @author max.zhang
 * @email max.zhang@tarsocial.com
 * @date 2023-10-08
 */

import React, { useState } from 'react';
import TrimInput from './TrimInput';

interface InnerInputProps {
  value: string;
  width?: number;
  onConfirm?: any;
  [key: string]: any;
}

export const TrimInnerInput: React.FC<InnerInputProps> = (props) => {
  const {
    value,
    width = 100,
    onConfirm = () => {},
    className,
    ...resProps
  } = props;
  const [showEditor, setShowEditor] = useState(true);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSumbit = () => {
    inputValue !== value && onConfirm(inputValue);
    setShowEditor(false);
  };

  const handleClick = () => {
    setShowEditor(true);
    setInputValue(value);
  };

  return showEditor ? (
    <TrimInput
      className={className}
      onChange={handleChange}
      onBlur={handleSumbit}
      onPressEnter={handleSumbit}
      autoFocus
      value={inputValue}
      style={{ width: width }}
      {...resProps}
    />
  ) : (
    <div className={className} onClick={handleClick} title={value || ''}>
      <span>{value || '-'}</span>
    </div>
  );
};
