import styled from 'styled-components';
import { shade } from 'polished';

const Container = styled.div``;

const Header = styled.header`
  padding: 32px 0;
  background: #28262e;
`;

const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  button {
    border: 0;
    background: transparent;
    margin-left: auto;

    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #ff9000;

      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
`;

const Schedule = styled.div`
  flex: 1;
  margin-right: 120px;

  h1 {
    font-size: 36px;
  }

  p {
    margin-top: 8px;
    color: #ff9000;
    font-weight: 500;

    span + span::before {
      content: '|';
      margin: 0px 8px;
    }
  }
`;

const Calendar = styled.aside`
  width: 380px;

  .DayPicker {
    background: #28262e;
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;

const NextAppointment = styled.div`
  margin-top: 64px;

  > strong {
    font-size: 20px;
    font-weight: 400;
    color: #999591;
  }

  div {
    background: #3e3b47;
    padding: 16px 24px;
    border-radius: 10px;
    margin-top: 24px;
    position: relative;
    display: flex;
    align-items: center;

    &::before {
      position: absolute;
      height: 80%;
      width: 1px;
      content: '';
      background: #ff9000;
      left: 0;
      top: 10%;
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
    }

    span {
      margin-left: auto;
      display: flex;
      align-items: center;
      color: #999591;

      svg {
        color: #ff9000;
        margin-right: 8px;
        margin-top: 2px;
      }
    }
  }
`;

const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  span {
    color: #999591;
  }
`;

const Appointment = styled.div`
  display: flex;
  align-items: center;

  & + div {
    margin-top: 16px;
  }

  span {
    margin-right: auto;
    display: flex;
    align-items: center;
    color: #f4ede8;

    svg {
      color: #ff9000;
      margin-right: 8px;
      margin-top: 2px;
    }
  }

  div {
    flex: 1;
    background: #3e3b47;
    padding: 16px 24px;
    border-radius: 10px;
    margin-left: 24px;
    display: flex;
    align-items: center;

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
      font-size: 20px;
    }
  }
`;

export {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
};
