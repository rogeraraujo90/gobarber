import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...otherProps }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isInputFilled, setInputFilled] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleInputFocused = useCallback(() => setInputFocused(true), []);
  const handleInputBlured = useCallback(() => {
    setInputFocused(false);
    setInputFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container isInputFocused={isInputFocused} isInputFilled={isInputFilled}>
      {Icon && <Icon size={20} />}
      <input
        ref={inputRef}
        defaultValue={defaultValue}
        {...otherProps}
        onFocus={handleInputFocused}
        onBlur={handleInputBlured}
      />
    </Container>
  );
};

export default Input;
