import styled, { css } from 'styled-components';
import Tootip from '../Tooltip';

interface ContainerProps {
  isInputFocused: boolean;
  isInputFilled: boolean;
  hasError: boolean;
}

const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;

  border: 2px solid #232129;
  color: #666360;

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: #c53030;
    `}

  ${({ isInputFocused }) =>
    isInputFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000;
    `}

  ${({ isInputFilled }) =>
    isInputFilled &&
    css`
      color: #ff9000;
    `}

  &::placeholder {
    color: #666360;
  }

  & + div {
    margin-top: 8px;
  }

  input {
    color: #f4ede8;
    background: transparent;
    flex: 1;
    border: none;
  }

  svg {
    margin-right: 16px;
  }
`;

const ErrorContainer = styled(Tootip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;

export { Container, ErrorContainer };
