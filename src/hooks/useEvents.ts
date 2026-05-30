import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { eventService } from '../services/eventService';
import { CalendarEvent } from '../types/event';

type EventFormInput = {
  hour: string;
  minute: string;
  details: string;
};

export function useEvents() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const unsubscribe = eventService.subscribeToEvents(setEvents, () => {
      showToast({
        title: 'Failed to load events',
        type: 'error',
      });
    });

    return unsubscribe;
  }, [showToast]);

  const saveEvent = useCallback(
    async (
      event: EventFormInput,
      selectedDate: Date,
      editingEvent: CalendarEvent | null,
    ) => {
      try {
        if (editingEvent) {
          await eventService.updateEvent(editingEvent.id, {
            date: selectedDate,
            ...event,
          });
        } else {
          await eventService.createEvent({
            date: selectedDate,
            ...event,
          });
        }
      } catch {
        showToast({
          title: editingEvent
            ? 'Failed to update event'
            : 'Failed to save event',
          type: 'error',
        });
        throw new Error('Event save failed');
      }
    },
    [showToast],
  );

  const deleteEvent = useCallback(
    async (event: CalendarEvent) => {
      try {
        await eventService.deleteEvent(event.id);
      } catch {
        showToast({
          title: 'Failed to delete event',
          type: 'error',
        });
      }
    },
    [showToast],
  );

  return { events, saveEvent, deleteEvent };
}
