import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const Container = styled.div`
  header {
    height: 144px;
    background: #28262e;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        width: 20px;
        height: 20px;
        color: #999591;

        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -95px auto 0;
`;

const AnimatedForm = styled.div`
  animation: ${keyframes`
    from {
      opacity 0;
      transform: translateY(50px);
    },

    to: {
      opacity: 1;
      transform: translateY(0);
    }
  `} 1s;

  form {
    margin: 0 auto;
    width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .profile__password-container {
      margin-top: 24px;
      width: 100%;
    }

    h1 {
      margin-top: 32px;
      margin-bottom: 24px;
      font-size: 20px;
    }
  }
`;

const AvatarContent = styled.div`
  position: relative;
  width: 186px;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  button {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: #ff9000;

    svg {
      color: #312e38;
    }

    transition: background-color 0.2s;

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export { Container, Content, AnimatedForm, AvatarContent };
