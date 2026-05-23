import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../../constants/theme';
import { CalendarEvent } from '../../../types/event';
import EventListItem from './EventListItem';

type EventListProps = {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  style?: StyleProp<ViewStyle>;
};

const EventList = ({
  events,
  onEdit,
  onDelete,
  ListHeaderComponent,
  style,
}: EventListProps) => {
  const renderItem: ListRenderItem<CalendarEvent> = ({ item }) => (
    <EventListItem event={item} onEdit={onEdit} onDelete={onDelete} />
  );

  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      style={[styles.list, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      ItemSeparatorComponent={EventListSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<Text style={styles.emptyText}>No events yet</Text>}
    />
  );
};

function EventListSeparator() {
  return <View style={styles.separator} />;
}

export default EventList;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: theme.textMuted,
    textAlign: 'center',
  },
});
