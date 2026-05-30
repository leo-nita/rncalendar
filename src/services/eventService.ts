import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
  FirestoreEventData,
} from '../types/event';

const EVENTS_COLLECTION = 'events';

function getCurrentUserId(): string {
  const user = auth().currentUser;

  if (!user) {
    throw new Error('User must be signed in to access events.');
  }

  return user.uid;
}

function getUserEventsCollection(userId: string) {
  return firestore()
    .collection('users')
    .doc(userId)
    .collection(EVENTS_COLLECTION);
}

function mapDocToEvent(
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): CalendarEvent {
  const data = doc.data() as Omit<
    FirestoreEventData,
    'createdAt' | 'updatedAt'
  >;
  const date = data.date.toDate();

  return {
    id: doc.id,
    date,
    hour: data.hour,
    minute: data.minute,
    details: data.details,
  };
}

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();

    if (dateCompare !== 0) {
      return dateCompare;
    }

    const aMinutes = Number(a.hour) * 60 + Number(a.minute);
    const bMinutes = Number(b.hour) * 60 + Number(b.minute);

    return aMinutes - bMinutes;
  });
}

export const eventService = {
  createEvent: async ({
    date,
    hour,
    minute,
    details,
  }: CreateEventInput): Promise<CalendarEvent> => {
    const userId = getCurrentUserId();
    const payload: FirestoreEventData = {
      date: firestore.Timestamp.fromDate(date),
      hour: hour,
      minute: minute,
      details: details,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await getUserEventsCollection(userId).add(payload);

    return {
      id: docRef.id,
      date,
      hour,
      minute,
      details,
    };
  },

  subscribeToEvents: (
    onEvents: (events: CalendarEvent[]) => void,
    onError?: (error: Error) => void,
  ): (() => void) => {
    const userId = getCurrentUserId();

    return getUserEventsCollection(userId).onSnapshot(
      snapshot => {
        onEvents(sortEvents(snapshot.docs.map(mapDocToEvent)));
      },
      error => {
        onError?.(error as Error);
      },
    );
  },

  updateEvent: async (
    eventId: string,
    { date, hour, minute, details }: UpdateEventInput,
  ): Promise<void> => {
    const userId = getCurrentUserId();
    const payload: Record<string, unknown> = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      date: firestore.Timestamp.fromDate(date),
    };

    if (hour !== undefined) {
      payload.hour = hour;
    }

    if (minute !== undefined) {
      payload.minute = minute;
    }

    if (details !== undefined) {
      payload.details = details;
    }

    await getUserEventsCollection(userId).doc(eventId).update(payload);
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    await getUserEventsCollection(userId).doc(eventId).delete();
  },
};
