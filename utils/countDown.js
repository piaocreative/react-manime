
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
const MILLISECONDS_PER_MINUTE = 1000 * 60;
const MILLISECONDS_PER_SECOND = 1000;

const countdownEndDateList = [
  {month: 8, day: 3},
  // {month: 6, day: 31},
  // {month: 9, day: 29},
  // {month: 10, day: 6},
  // {month: 10, day: 13},
];

function createLaunchDateByDay(monthNumber, dayNumber) {
  const time = new Date();
  time.setUTCMonth(monthNumber - 1);
  time.setUTCDate(dayNumber);
  time.setUTCHours(9 + 7); // PST 9:00 AM
  time.setUTCMinutes(0);
  time.setUTCSeconds(0);
  time.setUTCMilliseconds(0);
  return time;
}

function createLaunchDates({timerMonth, timerDay}) {
  return [createLaunchDateByDay(timerMonth, timerDay)];
  // const launchDates = [];
  // countdownEndDateList.map(launchDay => {
  //   launchDates.push(createLaunchDateByDay(launchDay.month, launchDay.day));
  // });
  // return launchDates;
}

function calculateTimeout(currentDate, launchDates) {
  let timeout = 0;
  launchDates.some(launchDate => {
    if (currentDate < launchDate) {
      timeout = launchDate - currentDate;
      return true;
    }
    return false;
  });
  return timeout;
}

function compareDates(props) {
  const {timerMonth, timerDay} = props;
  const launchDates = createLaunchDates({timerMonth, timerDay});
  const currentDate = new Date();
  const timeout = calculateTimeout(currentDate, launchDates);
  if (timeout > 0) {
    setTimeout(() => compareDates(props), timeout);
  }
  return timeout;
}

export default function getCountDownInfo({timerMonth, timerDay}) {
  const timeout = compareDates({timerMonth, timerDay});
  let remaining = 0;
  const days = Math.floor((timeout - remaining) / MILLISECONDS_PER_DAY);
  remaining += days * MILLISECONDS_PER_DAY;
  const hours = Math.floor((timeout - remaining) / MILLISECONDS_PER_HOUR);
  remaining += hours * MILLISECONDS_PER_HOUR;
  const minutes = Math.floor((timeout - remaining) / MILLISECONDS_PER_MINUTE);
  remaining += minutes * MILLISECONDS_PER_MINUTE;
  const seconds = Math.floor((timeout - remaining) / MILLISECONDS_PER_SECOND);
  const daysAndHours = (days * 24) + hours;
  return {
    timeout,
    daysAndHours,
    days,
    hours,
    minutes,
    seconds,
  }
}

