import styled from 'styled-components';
import { shade } from 'polished';

const Container = styled.button`
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

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;

export { Container };
