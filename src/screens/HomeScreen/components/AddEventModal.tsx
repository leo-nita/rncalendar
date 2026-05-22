import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type AddEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddEvent?: (event: {
    hour: string;
    minute: string;
    details: string;
  }) => void;
};

const MAX_EVENT_LENGTH = 60;

function AddEventModal({ visible, onClose, onAddEvent }: AddEventModalProps) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [details, setDetails] = useState('');

  const resetForm = () => {
    setHour('');
    setMinute('');
    setDetails('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddEvent = () => {
    onAddEvent?.({ hour, minute, details });
    resetForm();
    onClose();
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
              <Text style={styles.title}>Add Event</Text>
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
                <TextInput
                  style={styles.timeInput}
                  value={hour}
                  onChangeText={setHour}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  placeholderTextColor="#5a6478"
                  selectionColor="#4A90E2"
                />
                <TextInput
                  style={styles.timeInput}
                  value={minute}
                  onChangeText={setMinute}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  placeholderTextColor="#5a6478"
                  selectionColor="#4A90E2"
                />
              </View>
            </View>

            <TextInput
              style={styles.detailsInput}
              value={details}
              onChangeText={setDetails}
              placeholder="Enter Event Text (Maximum 60 Characters)"
              placeholderTextColor="#6b7280"
              maxLength={MAX_EVENT_LENGTH}
              multiline
              textAlignVertical="top"
              selectionColor="#4A90E2"
            />

            <Pressable style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.addButtonText}>ADD EVENT</Text>
            </Pressable>
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
  timeInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#4A90E2',
    borderBottomColor: '#4A90E2',
    textAlign: 'center',
  },
  detailsInput: {
    backgroundColor: '#12151a',
    borderRadius: 6,
    minHeight: 120,
    padding: 14,
    fontSize: 13,
    color: '#ffffff',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 16,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
});
