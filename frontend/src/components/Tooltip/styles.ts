import styled from 'styled-components';

const Container = styled.div`
  position: relative;

  span {
    visibility: hidden;
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #312e38;

    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    opacity: 0;
    transition: opacity 0.4s;

    &::before {
      content: '';
      border-style: solid;
      border-width: 6px 6px 0 6px;
      border-color: #ff9000 transparent;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

export { Container };
