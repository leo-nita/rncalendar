import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '../types/event';

const EVENTS_COLLECTION = 'events';

type FirestoreEventData = {
  date: FirebaseFirestoreTypes.Timestamp;
  hour: string;
  minute: string;
  details: string;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  updatedAt: FirebaseFirestoreTypes.FieldValue;
};

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
  createEvent: async (input: CreateEventInput): Promise<CalendarEvent> => {
    const userId = getCurrentUserId();
    const payload: FirestoreEventData = {
      date: firestore.Timestamp.fromDate(input.date),
      hour: input.hour,
      minute: input.minute,
      details: input.details,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await getUserEventsCollection(userId).add(payload);

    return {
      id: docRef.id,
      date: input.date,
      hour: input.hour,
      minute: input.minute,
      details: input.details,
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
    input: UpdateEventInput,
  ): Promise<void> => {
    const userId = getCurrentUserId();
    const payload: Record<string, unknown> = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      date: firestore.Timestamp.fromDate(input.date),
    };

    if (input.hour !== undefined) {
      payload.hour = input.hour;
    }

    if (input.minute !== undefined) {
      payload.minute = input.minute;
    }

    if (input.details !== undefined) {
      payload.details = input.details;
    }

    await getUserEventsCollection(userId).doc(eventId).update(payload);
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    await getUserEventsCollection(userId).doc(eventId).delete();
  },
};
