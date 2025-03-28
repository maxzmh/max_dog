import { Input, InputProps } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';

interface AutoWidthInputProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  minWidth?: number;
  className?: string;
}

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
  value = '',
  onChange,
  onConfirm,
  minWidth = 50,
  className = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [width, setWidth] = useState<number>(0);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<any>(null);
  const [focus, setFocus] = useState(false);

  const updateWidth = useCallback(() => {
    if (sizerRef.current) {
      const newWidth = Math.max(sizerRef.current.offsetWidth, minWidth);
      setWidth(newWidth);
    }
  }, [setWidth, minWidth]);

  useEffect(() => {
    setInputValue(value);
    updateWidth();
  }, [value, updateWidth]);

  useEffect(() => {
    updateWidth();
  }, [inputValue, updateWidth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      onConfirm?.(inputValue);
    }
  };

  const handleBlur = () => {
    onConfirm?.(inputValue);
    setFocus(false);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Input
        className={className}
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        variant="borderless"
        style={{
          width: width || 'auto',
          visibility: focus ? 'visible' : 'hidden',
        }}
        {...props}
      />
      <span
        ref={sizerRef}
        className={styles.sizer}
        onClick={() => {
          setFocus(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
        style={{
          visibility: focus ? 'hidden' : 'visible',
          zIndex: focus ? -1 : 1000,
        }}
        data-minWidth={minWidth + 'px'}
      >
        {inputValue || props.placeholder || ''}
      </span>
    </div>
  );
};

export default AutoWidthInput;
