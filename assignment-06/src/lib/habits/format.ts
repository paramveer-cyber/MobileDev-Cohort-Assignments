export function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatClockTime12Hour(hour: number, minute: number): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const period = normalizedHour >= 12 ? "PM" : "AM";
  const displayHour = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
  return `${displayHour}:${padTwoDigits(minute)} ${period}`;
}

export function formatIntervalHours(hours: number): string {
  return hours === 1 ? "Every hour" : `Every ${hours} hours`;
}
