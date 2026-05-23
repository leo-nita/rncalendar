import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { eventService } from './eventService';

function getEventsCollection() {
  return firestore()
    .collection('users')
    .doc('mock-user-123')
    .collection('events');
}

describe('eventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth().currentUser = { uid: 'mock-user-123', email: 'test@domain.com' };
  });

  describe('createEvent', () => {
    it('adds an event to the user events collection and returns it', async () => {
      const eventDate = new Date(2026, 4, 23);
      const input = {
        date: eventDate,
        hour: '14',
        minute: '30',
        details: 'Team standup',
      };

      const result = await eventService.createEvent(input);

      const eventsCollection = getEventsCollection();
      expect(eventsCollection.add).toHaveBeenCalledTimes(1);

      const [payload] = eventsCollection.add.mock.calls[0];
      expect(payload).toMatchObject({
        hour: '14',
        minute: '30',
        details: 'Team standup',
        createdAt: 'SERVER_TIMESTAMP',
        updatedAt: 'SERVER_TIMESTAMP',
      });
      expect(payload.date.toDate()).toEqual(eventDate);
      expect(result).toEqual({
        id: 'mock-event-id',
        date: eventDate,
        hour: '14',
        minute: '30',
        details: 'Team standup',
      });
    });

    it('throws when the user is not signed in', async () => {
      auth().currentUser = null;

      await expect(
        eventService.createEvent({
          date: new Date(),
          hour: '10',
          minute: '00',
          details: 'Meeting',
        }),
      ).rejects.toThrow('User must be signed in to access events.');
    });
  });

  describe('updateEvent', () => {
    it('always includes the date and updates the provided fields', async () => {
      const eventDate = new Date(2026, 5, 1);
      const eventsCollection = getEventsCollection();

      await eventService.updateEvent('event-42', {
        date: eventDate,
        hour: '09',
        details: 'Updated title',
      });

      expect(eventsCollection.doc).toHaveBeenCalledWith('event-42');
      const docRef = eventsCollection.doc.mock.results.at(-1)?.value;
      expect(docRef.update).toHaveBeenCalledTimes(1);

      const [payload] = docRef.update.mock.calls[0];
      expect(payload).toMatchObject({
        updatedAt: 'SERVER_TIMESTAMP',
        hour: '09',
        details: 'Updated title',
      });
      expect(payload.date.toDate()).toEqual(eventDate);
    });

    it('throws when the user is not signed in', async () => {
      auth().currentUser = null;

      await expect(
        eventService.updateEvent('event-42', {
          date: new Date(),
          details: 'Nope',
        }),
      ).rejects.toThrow('User must be signed in to access events.');
    });
  });

  describe('deleteEvent', () => {
    it('deletes the event document for the signed-in user', async () => {
      const eventsCollection = getEventsCollection();

      await eventService.deleteEvent('event-99');

      expect(eventsCollection.doc).toHaveBeenCalledWith('event-99');
      const docRef = eventsCollection.doc.mock.results.at(-1)?.value;
      expect(docRef.delete).toHaveBeenCalled();
    });
  });

  describe('subscribeToEvents', () => {
    it('returns sorted events from the snapshot listener', () => {
      const onEvents = jest.fn();
      const mockDocs = [
        {
          id: 'late',
          data: () => ({
            date: { toDate: () => new Date(2026, 4, 23, 0, 0) },
            hour: '15',
            minute: '00',
            details: 'Late meeting',
          }),
        },
        {
          id: 'early',
          data: () => ({
            date: { toDate: () => new Date(2026, 4, 23, 0, 0) },
            hour: '09',
            minute: '30',
            details: 'Morning sync',
          }),
        },
        {
          id: 'next-day',
          data: () => ({
            date: { toDate: () => new Date(2026, 4, 24, 0, 0) },
            hour: '08',
            minute: '00',
            details: 'Next day event',
          }),
        },
      ];

      getEventsCollection().onSnapshot.mockImplementation(
        (success: (snapshot: { docs: typeof mockDocs }) => void) => {
          success({ docs: mockDocs });
          return jest.fn();
        },
      );

      eventService.subscribeToEvents(onEvents);

      expect(onEvents).toHaveBeenCalledWith([
        {
          id: 'early',
          date: new Date(2026, 4, 23, 0, 0),
          hour: '09',
          minute: '30',
          details: 'Morning sync',
        },
        {
          id: 'late',
          date: new Date(2026, 4, 23, 0, 0),
          hour: '15',
          minute: '00',
          details: 'Late meeting',
        },
        {
          id: 'next-day',
          date: new Date(2026, 4, 24, 0, 0),
          hour: '08',
          minute: '00',
          details: 'Next day event',
        },
      ]);
    });
  });
});
