import { Input, InputProps } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { ComponentType, ReactElement } from 'react';

type WithNoSpace = <T extends object>(
  Component: ComponentType<T>,
) => (props: T) => ReactElement<T>;

export const withNoSpace: WithNoSpace = (Component) => (props) => {
  const { onChange, value, onBlur } = props;
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.trim();
    onBlur?.(e);
    if (value !== e.target.value) {
      onChange?.(e);
    }
  };
  return <Component {...props} onBlur={handleBlur} />;
};

const InnerInput = withNoSpace<InputProps>(Input as any);

const TextArea = withNoSpace<TextAreaProps>(Input.TextArea as any);

type CompoundedComponent = typeof InnerInput & {
  TextArea: typeof TextArea;
};

const TrimInput = InnerInput as CompoundedComponent;
TrimInput.TextArea = TextArea;
export default TrimInput;
