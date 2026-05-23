import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { eventService } from '../services/eventService';
import { CalendarEvent } from '../types/event';

const mockShowToast = jest.fn();

jest.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('../services/eventService', () => ({
  eventService: {
    subscribeToEvents: jest.fn(),
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  },
}));

const mockEvent: CalendarEvent = {
  id: 'event-1',
  date: new Date(2026, 4, 23),
  hour: '10',
  minute: '30',
  details: 'Existing event',
};

let eventsCallback: (events: CalendarEvent[]) => void = () => {};

const renderHomeScreen = () => render(<HomeScreen />);

const fillEventForm = (
  getAllByPlaceholderText: ReturnType<typeof render>['getAllByPlaceholderText'],
  getByPlaceholderText: ReturnType<typeof render>['getByPlaceholderText'],
  getAllByText: ReturnType<typeof render>['getAllByText'],
  details: string,
) => {
  const [hourInput, minuteInput] = getAllByPlaceholderText('00');
  fireEvent.changeText(hourInput, '11');
  fireEvent.changeText(minuteInput, '45');
  fireEvent.changeText(
    getByPlaceholderText('Enter Event Text (Maximum 60 Characters)'),
    details,
  );
  fireEvent.press(getAllByText('ADD EVENT').at(-1)!);
};

describe('HomeScreen event actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    eventsCallback = () => {};

    (eventService.subscribeToEvents as jest.Mock).mockImplementation(
      onEvents => {
        eventsCallback = onEvents;
        onEvents([]);
        return jest.fn();
      },
    );

    (eventService.createEvent as jest.Mock).mockResolvedValue({
      ...mockEvent,
      id: 'new-event-id',
    });
    (eventService.updateEvent as jest.Mock).mockResolvedValue(undefined);
    (eventService.deleteEvent as jest.Mock).mockResolvedValue(undefined);
  });

  it('creates an event from the add modal', async () => {
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getAllByPlaceholderText,
      queryByText,
    } = renderHomeScreen();

    fireEvent.press(getAllByText('ADD EVENT')[0]);
    expect(getByText('Add Event')).toBeTruthy();

    fillEventForm(
      getAllByPlaceholderText,
      getByPlaceholderText,
      getAllByText,
      'New team meeting',
    );

    await waitFor(() => {
      expect(eventService.createEvent).toHaveBeenCalledWith({
        date: expect.any(Date),
        hour: '11',
        minute: '45',
        details: 'New team meeting',
      });
    });
    expect(queryByText('Add Event')).toBeNull();
  });

  it('updates an event when editing and saving', async () => {
    const {
      getByLabelText,
      getByText,
      getAllByPlaceholderText,
      getByPlaceholderText,
      queryByText,
    } = renderHomeScreen();

    act(() => {
      eventsCallback([mockEvent]);
    });

    fireEvent.press(getByLabelText('Edit event'));
    expect(getByText('Edit Event')).toBeTruthy();
    expect(
      getByPlaceholderText('Enter Event Text (Maximum 60 Characters)').props
        .value,
    ).toBe('Existing event');

    const [hourInput] = getAllByPlaceholderText('00');
    fireEvent.changeText(hourInput, '16');
    fireEvent.changeText(
      getByPlaceholderText('Enter Event Text (Maximum 60 Characters)'),
      'Updated event',
    );
    fireEvent.press(getByText('SAVE EVENT'));

    await waitFor(() => {
      expect(eventService.updateEvent).toHaveBeenCalledWith('event-1', {
        date: mockEvent.date,
        hour: '16',
        minute: '30',
        details: 'Updated event',
      });
    });
    expect(queryByText('Edit Event')).toBeNull();
  });

  it('deletes an event from the list', async () => {
    const { getByLabelText } = renderHomeScreen();

    act(() => {
      eventsCallback([mockEvent]);
    });

    fireEvent.press(getByLabelText('Delete event'));

    await waitFor(() => {
      expect(eventService.deleteEvent).toHaveBeenCalledWith('event-1');
    });
  });

  it('shows an error toast when creating an event fails', async () => {
    (eventService.createEvent as jest.Mock).mockRejectedValue(
      new Error('Firestore error'),
    );

    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getAllByPlaceholderText,
    } = renderHomeScreen();

    fireEvent.press(getAllByText('ADD EVENT')[0]);
    fillEventForm(
      getAllByPlaceholderText,
      getByPlaceholderText,
      getAllByText,
      'Broken event',
    );

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Failed to save event',
        type: 'error',
      });
    });
    expect(getByText('Add Event')).toBeTruthy();
  });

  it('shows an error toast when updating an event fails', async () => {
    (eventService.updateEvent as jest.Mock).mockRejectedValue(
      new Error('Firestore error'),
    );

    const { getByLabelText, getByText, getByPlaceholderText } =
      renderHomeScreen();

    act(() => {
      eventsCallback([mockEvent]);
    });

    fireEvent.press(getByLabelText('Edit event'));
    fireEvent.changeText(
      getByPlaceholderText('Enter Event Text (Maximum 60 Characters)'),
      'Still broken',
    );
    fireEvent.press(getByText('SAVE EVENT'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Failed to update event',
        type: 'error',
      });
    });
    expect(getByText('Edit Event')).toBeTruthy();
  });

  it('shows an error toast when deleting an event fails', async () => {
    (eventService.deleteEvent as jest.Mock).mockRejectedValue(
      new Error('Firestore error'),
    );

    const { getByLabelText } = renderHomeScreen();

    act(() => {
      eventsCallback([mockEvent]);
    });

    fireEvent.press(getByLabelText('Delete event'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Failed to delete event',
        type: 'error',
      });
    });
  });
});
