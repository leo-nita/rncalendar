import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AddEventModal from './components/AddEventModal';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import PrimaryButton from '../../components/Button';
import ScreenContainer from '../../components/ScreenContainer';
import { theme } from '../../constants/theme';
import { useEvents } from '../../hooks/useEvents';
import { CalendarEvent } from '../../types/event';

function HomeScreen() {
  const currentDate = new Date();
  const { events, saveEvent, deleteEvent } = useEvents();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleCalendarSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowAddEventModal(true);
  }, []);

  const handleAddEvent = useCallback(
    async (event: { hour: string; minute: string; details: string }) => {
      await saveEvent(event, selectedDate, editingEvent);
    },
    [editingEvent, saveEvent, selectedDate],
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
        onDelete={deleteEvent}
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
