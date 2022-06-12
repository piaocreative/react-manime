export const decimalFormat = (value,  n = 2) => {
  return parseFloat(value).toFixed(n || 2);
}

// get UTC time from date and offset
export const getExpireTime = (date, offsetMinutes = 0) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const expireTime = Date.UTC(year, month, day, hour, minute + offsetMinutes);
  return expireTime;
}