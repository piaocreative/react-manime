import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Box from 'components/styled/Box';
import getCountDownInfo from 'utils/countDown';

const CountDownBoard = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 12px;
  padding: 12px 0;
  @media(min-width: 768px) {
    padding: 20px 0;
  }
  @media(min-width: 1024px) {
    padding: 6px 0;
  }
  @media(min-width: 1400px) {
    padding: 6px 0;
  }
  @media(min-width: 1540px) {
    padding: 14px 0;
  }
`;

const Digit = styled(Box)`
  font-size: 24px;
  color: #fff;

  @media(min-width: 768px) {
    font-size: 28px;
  }
`;

const TimeSlot = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
`;

const TimeUnit = styled(Box)`
  font-size: 12px;
  color: #fff;
  text-transform: uppercase;
  @media(min-width: 768px) {
    font-size: 14px;
  }
`;

const CountDownPanel = ({timerMonth, timerDay}) => {
  const [dayDisplay, setDayDisplay] = useState('00');
  const [hourDisplay, setHourDisplay] = useState('00');
  const [minuteDisplay, setMinuteDisplay] = useState('00');
  const [secondDisplay, setSecondDisplay] = useState('00');

  const updateCountdown = () => {
    const {
      days,
      hours,
      minutes,
      seconds,
    } = getCountDownInfo({timerMonth, timerDay});
    setDayDisplay(`${days > 9 ? '': '0'}${days}`);
    setHourDisplay(`${hours > 9 ? '' : '0'}${hours}`);
    setMinuteDisplay(`${minutes > 9 ? '' : '0'}${minutes}`);
    setSecondDisplay(`${seconds > 9 ? '' : '0'}${seconds}`);
    setTimeout(() => {
      updateCountdown();
    }, 1000);
  };

  useEffect(() => {
    updateCountdown();
  }, [])

  return (
    <CountDownBoard>
      <TimeSlot>
        <Digit>{dayDisplay}</Digit>
        <TimeUnit>days</TimeUnit>
      </TimeSlot>
      <TimeSlot>
        <Digit>{hourDisplay}</Digit>
        <TimeUnit>hours</TimeUnit>
      </TimeSlot>
      <TimeSlot>
        <Digit>{minuteDisplay}</Digit>
        <TimeUnit>minutes</TimeUnit>
      </TimeSlot>
      <TimeSlot>
        <Digit>{secondDisplay}</Digit>
        <TimeUnit>seconds</TimeUnit>
      </TimeSlot>
    </CountDownBoard>
  );
};

export default CountDownPanel;