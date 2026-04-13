import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from '@/components/ui';
import { CalendarList, DateData } from 'react-native-calendars';
import { useTheme } from '@/hooks/useTheme';
import dayjs from 'dayjs';

type CalendarSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal>;
  onClose?: VoidFunction;
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
};

const CalendarSheet: React.FC<CalendarSheetProps> = ({
  sheetRef,
  onClose,
  onSelectDate,
  selectedDate = '',
}) => {
  const [selected, setSelected] = useState(selectedDate);
  const [pending, setPending] = useState(selectedDate); // ✅ local uncommitted selection
  const { primary, border } = useTheme();

  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    setSelected(selectedDate);
    setPending(selectedDate);
  }, [selectedDate]);

  const handleDayPress = useCallback((day: DateData) => {
    setPending(day.dateString);
  }, []);

  const handleSave = useCallback(() => {
    if (pending) {
      setSelected(pending);
      onSelectDate?.(pending);
    }
    onClose?.();
  }, [pending, onSelectDate, onClose]);

  const markedDates = useCallback(() => {
    const marks: Record<string, object> = {};

    if (pending) {
      marks[pending] = {
        selected: true,
        disableTouchEvent: true,
        selectedColor: primary,
      };
    }

    if (today !== pending) {
      marks[today] = {
        marked: true,
        dotColor: primary,
      };
    }

    return marks;
  }, [pending, primary, today]);

  const theme = useCallback(
    () => ({
      backgroundColor: border,
      calendarBackground: border,
      dayTextColor: '#fff',
      textDisabledColor: '#444',
      monthTextColor: '#fff',
      selectedDayBackgroundColor: primary,
      selectedDayTextColor: '#fff',
      todayTextColor: primary,
      textSectionTitleColor: '#888',
      arrowColor: primary,
    }),
    [border, primary],
  );

  // const HeaderRight = useCallback(
  //   () => <HapticButton style={styles.button} onPress={handleSave} type="save" />,
  //   [handleSave],
  // );

  return (
    <BottomSheet
      onClose={onClose}
      bottomSheetRef={sheetRef}
      snapPoints={['50%', '90%']}
      title="Due Date"
      titleStyle={styles.titleStyle}
      // headerRight={HeaderRight}
    >
      <View style={styles.calendarWrapper}>
        <CalendarList
          current={today}
          minDate={today}
          pastScrollRange={0}
          futureScrollRange={12}
          scrollEnabled
          showScrollIndicator={false}
          onDayPress={handleDayPress}
          markedDates={markedDates()}
          theme={theme()}
        />
      </View>
    </BottomSheet>
  );
};

export default memo(CalendarSheet);

const styles = StyleSheet.create({
  button: {
    height: 35,
    width: 35,
  },
  titleStyle: {
    paddingLeft: 36,
  },
  calendarWrapper: {
    flex: 1,
  },
  calendar: {
    flex: 1,
  },
});
