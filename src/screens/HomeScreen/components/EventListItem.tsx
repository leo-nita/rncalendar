import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MONTHS } from '../../../constants/calendar';
import { CalendarEvent } from '../../../types/event';

type EventListItemProps = {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
};

function formatEventDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatEventTime(hour: string, minute: string): string {
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

const EventListItem = ({ event, onEdit, onDelete }: EventListItemProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.timeSection}>
        <Text style={styles.dateText}>{formatEventDate(event.date)}</Text>
        <Text style={styles.timeText}>
          {formatEventTime(event.hour, event.minute)}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title} numberOfLines={2}>
        {event.details}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onEdit(event)}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Edit event"
        >
          <Text style={styles.actionIcon}>✎</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(event)}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Delete event"
        >
          <Text style={styles.actionIcon}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EventListItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A3FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 60,
  },
  timeSection: {
    justifyContent: 'center',
    gap: 2,
    minWidth: 88,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    opacity: 0.85,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 2,
    marginLeft: 12,
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
