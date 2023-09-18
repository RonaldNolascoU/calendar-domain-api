export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type Duration = {
    hours: number;
    minutes: number;
};

export interface RecurringRule {
    frequency: RecurringFrequency;
    count?: number; // Number of times the event should recur
    until?: Date; // The date until which the event should recur
}


export interface CalendarEvent {
    id: string;
    startDate: Date;
    duration: Duration;
    title: string;
    recurringRule?: RecurringRule;
    parentEventId?: string;  // This is to track if this event is an instance of a recurring event
}
