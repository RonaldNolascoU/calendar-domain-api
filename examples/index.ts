import { CalendarAPI } from 'calendar-domain-api/src/CalendarAPI';

const calendarAPI = new CalendarAPI();

const newEvent = calendarAPI.createEvent(
  new Date('2023-09-18T14:30:00'),
  { hours: 1, minutes: 30 },
  'Meeting'
);

console.log({newEvent});