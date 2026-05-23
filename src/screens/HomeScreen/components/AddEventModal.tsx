import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import InputField from '../../../components/Input';
import PrimaryButton from '../../../components/Button';
import { validateHour, validateMinute } from '../../../utils/validate';
import {
  MAX_EVENT_LENGTH,
  TIME_INPUT_MAX_LENGTH,
} from '../../../constants/event';
import { CalendarEvent } from '../../../types/event';

type AddEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddEvent?: (event: {
    hour: string;
    minute: string;
    details: string;
  }) => void | Promise<void>;
  initialEvent?: CalendarEvent | null;
};

function AddEventModal({
  visible,
  onClose,
  onAddEvent,
  initialEvent = null,
}: AddEventModalProps) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [details, setDetails] = useState('');
  const isEditing = initialEvent !== null;

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (initialEvent) {
      setHour(initialEvent.hour);
      setMinute(initialEvent.minute);
      setDetails(initialEvent.details);
      return;
    }

    setHour('');
    setMinute('');
    setDetails('');
  }, [initialEvent, visible]);

  const resetForm = () => {
    setHour('');
    setMinute('');
    setDetails('');
  };

  const handleHourChange = (text: string) => {
    setHour(validateHour(text));
  };

  const handleMinuteChange = (text: string) => {
    setMinute(validateMinute(text));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddEvent = async () => {
    try {
      await onAddEvent?.({ hour, minute, details });
      resetForm();
      onClose();
    } catch {
      // Keep the modal open so the user can retry.
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centered}
        >
          <View style={styles.dialog}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEditing ? 'Edit Event' : 'Add Event'}
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={12}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>TIME</Text>
              </View>
              <View style={styles.timeInputs}>
                <InputField
                  value={hour}
                  onChangeText={handleHourChange}
                  keyboardType="numeric"
                  maxLength={TIME_INPUT_MAX_LENGTH}
                  placeholder="00"
                  placeholderTextColor="#5a6478"
                  selectionColor="#4A90E2"
                  containerStyle={styles.timeInputContainer}
                  inputStyle={styles.timeInput}
                />
                <InputField
                  value={minute}
                  onChangeText={handleMinuteChange}
                  keyboardType="numeric"
                  maxLength={TIME_INPUT_MAX_LENGTH}
                  placeholder="00"
                  placeholderTextColor="#5a6478"
                  selectionColor="#4A90E2"
                  containerStyle={styles.timeInputContainer}
                  inputStyle={styles.timeInput}
                />
              </View>
            </View>

            <InputField
              value={details}
              onChangeText={setDetails}
              placeholder="Enter Event Text (Maximum 60 Characters)"
              placeholderTextColor="#6b7280"
              maxLength={MAX_EVENT_LENGTH}
              multiline
              textAlignVertical="top"
              selectionColor="#4A90E2"
              containerStyle={styles.detailsContainer}
              inputStyle={styles.detailsInput}
            />

            <PrimaryButton
              title={isEditing ? 'SAVE EVENT' : 'ADD EVENT'}
              onPress={handleAddEvent}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default AddEventModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centered: {
    width: '100%',
    maxWidth: 360,
  },
  dialog: {
    backgroundColor: '#1A1D23',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 10,
    marginRight: -6,
    marginTop: -6,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  timeLabel: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
  },
  timeLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  timeInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  timeInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  timeInput: {
    borderWidth: 0,
    marginTop: 0,
    padding: 0,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#4A90E2',
    borderBottomColor: '#4A90E2',
    borderRadius: 0,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailsInput: {
    borderWidth: 0,
    marginTop: 0,
    backgroundColor: '#12151a',
    borderRadius: 6,
    minHeight: 120,
    padding: 14,
    fontSize: 13,
    color: '#ffffff',
  },
});
