import { format, getTime, formatDistanceToNow, add } from 'date-fns';

export function fDate(date: Date, newFormat: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: Date, newFormat: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: Date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: Date) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export function convertToTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function fDateVerbose(date: Date) {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function fDateAdd(date: Date, days: number) {
  return add(date, { days: days });
}

export function formatTimeToAMPM(timeString: string) {
  const [hours24, minutes] = timeString.split(':').map(Number);
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format and handle midnight

  return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}