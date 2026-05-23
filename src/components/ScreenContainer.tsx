import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../constants/theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

const ScreenContainer = ({
  children,
  scrollable = false,
  contentStyle,
}: ScreenContainerProps) => {
  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.staticContent, contentStyle]}>
      {children}
    </View>
  );
};

export default ScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  staticContent: {
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
});
