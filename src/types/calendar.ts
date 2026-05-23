export type CalendarState = {
  month: number;
  year: number;
};

export type CalendarAction = { type: 'PREV_MONTH' } | { type: 'NEXT_MONTH' };

export type CalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};
