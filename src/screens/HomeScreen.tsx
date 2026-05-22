import React, { useReducer, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AddEventModal from './HomeScreen/components/AddEventModal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type CalendarState = {
  month: number;
  year: number;
};

type CalendarAction = { type: 'PREV_MONTH' } | { type: 'NEXT_MONTH' };

type CalendarEvent = {
  id: string;
  date: Date;
  hour: string;
  minute: string;
  details: string;
};

function getInitialCalendarState(): CalendarState {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}
const isToday = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

function calendarReducer(
  state: CalendarState,
  action: CalendarAction,
): CalendarState {
  switch (action.type) {
    case 'PREV_MONTH':
      if (state.month === 0) {
        return { month: 11, year: state.year - 1 };
      }
      return { ...state, month: state.month - 1 };
    case 'NEXT_MONTH':
      if (state.month === 11) {
        return { month: 0, year: state.year + 1 };
      }
      return { ...state, month: state.month + 1 };
    default:
      return state;
  }
}

function HomeScreen() {
  const { userEmail } = useAuth();
  const currentDate = new Date();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendar, dispatch] = useReducer(
    calendarReducer,
    undefined,
    getInitialCalendarState,
  );
  const daysInMonth = new Date(calendar.year, calendar.month + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendar.year, calendar.month, 1).getDay();

  const isViewingCurrentMonth =
    calendar.month === currentDate.getMonth() &&
    calendar.year === currentDate.getFullYear();
  const handleSelectDate = (day: number) => {
    const clickedDate = new Date(calendar.year, calendar.month, day);

    if (clickedDate >= currentDate || isToday(clickedDate, currentDate)) {
      setSelectedDate(clickedDate);
      setShowAddEventModal(true);
    }
    // setSelectedDate(date);
  };

  const handleAddEvent = (event: {
    hour: string;
    minute: string;
    details: string;
  }) => {
    setEvents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        date: selectedDate,
        ...event,
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Text>Welcome : {userEmail}</Text>

      <View style={styles.calendarCard}>
        <Text style={styles.calendarTitle}>CALENDAR</Text>

        <View style={styles.monthRow}>
          <View style={styles.monthLabel}>
            <Text style={styles.monthText}>{MONTHS[calendar.month]},</Text>
            <Text style={styles.monthText}>{calendar.year}</Text>
          </View>
          <View style={styles.navButtons}>
            <Pressable
              onPress={() => dispatch({ type: 'PREV_MONTH' })}
              style={styles.navButton}
            >
              <Text style={styles.navArrow}>‹</Text>
            </Pressable>
            <Pressable
              onPress={() => dispatch({ type: 'NEXT_MONTH' })}
              style={styles.navButton}
            >
              <Text style={styles.navArrow}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAYS.map(day => (
            <View key={day} style={styles.dayCell}>
              <Text style={styles.weekdayText}>{day.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.days}>
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday =
              isViewingCurrentMonth && day === currentDate.getDate();

            return (
              <Pressable
                onPress={() => handleSelectDate(day)}
                key={day}
                style={[styles.dayCell, isToday && styles.selectedDay]}
              >
                <Text
                  style={[styles.dayText, isToday && styles.selectedDayText]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pressable
        style={styles.addEventTrigger}
        onPress={() => setShowAddEventModal(true)}
      >
        <Text style={styles.addEventTriggerText}>ADD EVENT</Text>
      </Pressable>

      <AddEventModal
        visible={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onAddEvent={handleAddEvent}
      />

      {events.map(event => (
        <View key={event.id} style={styles.eventItem}>
          <Text style={styles.eventTime}>
            {event.hour.padStart(2, '0')}:{event.minute.padStart(2, '0')}
          </Text>
          <Text style={styles.eventDetails}>{event.details}</Text>
        </View>
      ))}
    </View>
  );
}
export default HomeScreen;
const CELL_WIDTH = `${100 / 7}%`;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#0f1117',
  },
  calendarCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1e222d',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  calendarTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthLabel: {
    flexDirection: 'row',
    gap: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#c8cdd6',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2f3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e8871a',
    lineHeight: 20,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_WIDTH,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7a8290',
    letterSpacing: 0.5,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  selectedDay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e8871a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  addEventTrigger: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#e8871a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addEventTriggerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.2,
  },
  eventItem: {
    width: '100%',
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e222d',
    borderRadius: 8,
    padding: 12,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8871a',
  },
  eventDetails: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
  },
});
