import { CalendarError } from "./errors/CalendarError";
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, Duration, RecurringRule } from "./types";

export class CalendarAPI {
  private events: CalendarEvent[] = [];

  private isOverlapping(eventA: CalendarEvent, eventB: CalendarEvent): boolean {
    const endA = new Date(eventA.startDate);
    const durationA = eventA.duration;
    endA.setHours(endA.getHours() + durationA.hours, endA.getMinutes() + durationA.minutes);

    const endB = new Date(eventB.startDate);
    const durationB = eventB.duration;
    endB.setHours(endB.getHours() + durationB.hours, endB.getMinutes() + durationB.minutes);

    return endA > eventB.startDate && eventA.startDate < endB;
  }
  
  createEvent(startDate: Date, duration: Duration, title: string, allowOverlap: boolean = false, recurringRule?: RecurringRule): CalendarEvent | CalendarError {
    for (const event of this.events) {
      if (!allowOverlap && this.isOverlapping(event, { startDate, duration, title } as CalendarEvent)) {
        return new CalendarError('Event overlaps with an existing event.');
      }
    }

    // Create a new event
    const newEvent: CalendarEvent = {
      id: uuidv4(),
      startDate,
      duration,
      title,
      recurringRule,
    };

    this.events.push(newEvent);
    return newEvent;
  }

  listEvents(from: Date, to: Date): CalendarEvent[] {
    return this.events.filter((event) => {
      const eventEnd = new Date(event.startDate);
      const duration = event.duration;
      eventEnd.setHours(eventEnd.getHours() + duration.hours, eventEnd.getMinutes() + duration.minutes);

      return event.startDate >= from && eventEnd <= to;
    });
  }

  updateEvent(id: string, newStartDate: Date, newDuration: Duration, newTitle: string, allowOverlap: boolean = false, newRecurringRule?: RecurringRule): CalendarEvent | CalendarError {
    const eventIndex = this.events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return new CalendarError('Event not found.');
    }

    const updatedEvent: CalendarEvent = {
      ...this.events[eventIndex],
      startDate: newStartDate,
      duration: newDuration,
      title: newTitle,
      recurringRule: newRecurringRule,
    };

    // Check for overlaps with other existing events
    for (const event of this.events) {
      if (event.id !== id && !allowOverlap && this.isOverlapping(event, updatedEvent)) {
        return new CalendarError('Updated event overlaps with an existing event.');
      }
    }

    this.events[eventIndex] = updatedEvent;
    return updatedEvent;
  }

  deleteEvent(id: string): boolean | CalendarError {
    const eventIndex = this.events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return new CalendarError('Event not found.');
    }

    this.events.splice(eventIndex, 1);
    return true;
  }

  // Bonus: Recurring events methods
  // ...
}
