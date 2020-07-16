import styled, { css } from 'styled-components';
import { shade } from 'polished';
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: number;
};

const Container = styled.button<ButtonProps>`
  border: 0;
  background: #ff9000;
  border-radius: 10px;
  margin-top: 16px;
  height: 56px;
  color: #312e38;
  padding: 0 16px;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.2s;

  ${({ isLoading }) => {
    if (isLoading) {
      return css`
        opacity: 0.6;
      `;
    }

    return css`
      &:hover {
        background-color: ${shade(0.2, '#ff9000')};
      }
    `;
  }};
`;

export { Container };
