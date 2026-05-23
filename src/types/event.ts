export type CalendarEvent = {
  id: string;
  date: Date;
  hour: string;
  minute: string;
  details: string;
};

export type CreateEventInput = {
  date: Date;
  hour: string;
  minute: string;
  details: string;
};

export type UpdateEventInput = Partial<CreateEventInput>;
