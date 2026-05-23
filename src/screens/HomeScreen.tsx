import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AddEventModal from './HomeScreen/components/AddEventModal';
import Calendar from './HomeScreen/components/Calendar';
import EventList from './HomeScreen/components/EventList';
import PrimaryButton from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { useToast } from '../context/ToastContext';
import { theme } from '../constants/theme';
import { eventService } from '../services/eventService';
import { CalendarEvent } from '../types/event';

function HomeScreen() {
  const currentDate = new Date();
  const { showToast } = useToast();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);
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

  const handleCalendarSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowAddEventModal(true);
  }, []);

  const handleAddEvent = useCallback(
    async (event: { hour: string; minute: string; details: string }) => {
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
    [editingEvent, selectedDate, showToast],
  );

  const handleDeleteEvent = useCallback(
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

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setShowAddEventModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddEventModal(false);
    setEditingEvent(null);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingEvent(null);
    setShowAddEventModal(true);
  }, []);

  const listHeader = (
    <View style={styles.listHeader}>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={handleCalendarSelectDate}
      />
      <PrimaryButton
        title="ADD EVENT"
        onPress={handleOpenAddModal}
        style={styles.addEventTrigger}
        textStyle={styles.addEventTriggerText}
      />
    </View>
  );

  return (
    <ScreenContainer contentStyle={styles.screen}>
      <EventList
        events={events}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        ListHeaderComponent={listHeader}
      />

      <AddEventModal
        visible={showAddEventModal}
        onClose={handleCloseModal}
        onAddEvent={handleAddEvent}
        initialEvent={editingEvent}
      />
    </ScreenContainer>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 0,
  },
  listHeader: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  addEventTrigger: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.accent,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addEventTriggerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: 1.2,
  },
});
