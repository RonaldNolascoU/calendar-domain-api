
import { CalendarAPI } from '../src/CalendarAPI';
import { CalendarError } from '../src/errors/CalendarError';
import { beforeEach, describe, expect, it } from 'bun:test';
import { Duration, RecurringRule } from '../src/types';

describe('CalendarAPI', () => {
  let calendarAPI: CalendarAPI;
  let duration: Duration;
  let startDate: Date;
  let title: string;
  let recurringRule: RecurringRule;

  beforeEach(() => {
    calendarAPI = new CalendarAPI();
    duration = { hours: 1, minutes: 30 };
    startDate = new Date(2023, 9, 18, 14, 30);
    title = "Meeting";
    recurringRule = { frequency: 'WEEKLY' };
  });

  describe('createEvent', () => {
    it('should create a new event', () => {
      const newEvent = calendarAPI.createEvent(startDate, duration, title);
      expect(newEvent).toHaveProperty('id');
      expect(newEvent).toHaveProperty('startDate', startDate);
      expect(newEvent).toHaveProperty('duration', duration);
      expect(newEvent).toHaveProperty('title', title);
    });

    it('should not create overlapping events', () => {
      calendarAPI.createEvent(startDate, duration, title);
      const newEvent = calendarAPI.createEvent(startDate, duration, 'Another Meeting');
      expect(newEvent).toBeInstanceOf(CalendarError);
    });

    it('should allow overlapping events when specified', () => {
      calendarAPI.createEvent(startDate, duration, title);
      const newEvent = calendarAPI.createEvent(startDate, duration, 'Another Meeting', true);
      expect(newEvent).not.toBeInstanceOf(CalendarError);
    });

    it('should create recurring events', () => {
      const newEvent = calendarAPI.createEvent(startDate, duration, title, false, recurringRule);
      expect(newEvent).toHaveProperty('recurringRule', recurringRule);
    });
  });

  describe('listEvents', () => {
    it('should list events within a date range', () => {
      calendarAPI.createEvent(startDate, duration, title);
      const events = calendarAPI.listEvents(new Date(2023, 9, 18, 0, 0), new Date(2023, 9, 19, 0, 0));
      expect(events).toHaveLength(1);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', () => {
      const event = calendarAPI.createEvent(startDate, duration, title) as any;
      const updatedEvent = calendarAPI.updateEvent(event.id, new Date(2023, 9, 19, 14, 30), { hours: 2, minutes: 0 }, 'Updated Meeting') as any;
      expect(updatedEvent.title).toBe('Updated Meeting');
    });

    it('should not update to overlapping events', () => {
      calendarAPI.createEvent(startDate, duration, title);
      const event = calendarAPI.createEvent(new Date(2023, 9, 19, 14, 30), duration, 'Second Meeting') as any;
      const updatedEvent = calendarAPI.updateEvent(event.id, startDate, duration, 'Updated Meeting');
      expect(updatedEvent).toBeInstanceOf(CalendarError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an existing event', () => {
      const event = calendarAPI.createEvent(startDate, duration, title) as any;
      const result = calendarAPI.deleteEvent(event.id);
      expect(result).toBe(true);
    });

    it('should not delete a non-existing event', () => {
      const result = calendarAPI.deleteEvent('nonexistent-id');
      expect(result).toBeInstanceOf(CalendarError);
    });
  });

  // Add more test cases and for bonus features like recurring events
});
