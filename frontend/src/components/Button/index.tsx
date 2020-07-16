import React, { ButtonHTMLAttributes } from 'react';
import { FiLoader } from 'react-icons/fi';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  ...otherProps
}) => (
  <Container {...otherProps} isLoading={Number(isLoading)} disabled={isLoading}>
    {isLoading ? <FiLoader size={18} /> : children}
  </Container>
);

export default Button;
