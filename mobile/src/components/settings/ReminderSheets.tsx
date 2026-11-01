import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HapticButton } from '@/components/layout';
import { BottomSheet, type BottomSheetModal, ThemedText } from '@/components/ui';
import { type Weekday } from '@/hooks/usePreferences';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';
import {
  formatReminderTime,
  parseReminderTime,
  toTimeString,
  WEEKDAYS,
} from '@/utils/notifications';
import { toast } from '@/utils/toast';

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = Array.from({ length: 60 }, (_, idx) => idx);
const PERIODS = ['AM', 'PM'] as const;
type Period = (typeof PERIODS)[number];

type WeekdaySheetProps = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  selectedDay: Weekday;
  onSelect: (day: Weekday) => void;
};

export const WeekdaySheet: React.FC<WeekdaySheetProps> = ({
  sheetRef,
  selectedDay,
  onSelect,
}) => {
  const { card, text, primary, surface, border } = useTheme();

  return (
    <BottomSheet
      bottomSheetRef={sheetRef}
      snapPoints={['58%']}
      backgroundStyle={{ backgroundColor: card }}
      title={
        <View style={styles.header}>
          <Ionicons name="calendar-outline" color={text} size={20} />
          <ThemedText type="subtitle" style={{ color: text }}>
            Choose Weekday
          </ThemedText>
        </View>
      }
    >
      <View style={styles.dayList}>
        {WEEKDAYS.map(day => {
          const isSelected = day === selectedDay;
          return (
            <HapticButton
              key={day}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={day}
              onPress={() => onSelect(day)}
              style={[
                styles.dayItem,
                {
                  backgroundColor: isSelected ? primary + '18' : surface,
                  borderColor: isSelected ? primary : border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.dayLabel,
                  {
                    color: isSelected ? primary : text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {day}
              </ThemedText>
              {isSelected && <Ionicons name="checkmark-circle" size={20} color={primary} />}
            </HapticButton>
          );
        })}
      </View>
    </BottomSheet>
  );
};

type TimePickerSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title?: string;
  time: string;
  onSelect: (time: string) => void;
};

export const TimePickerSheet: React.FC<TimePickerSheetProps> = ({
  sheetRef,
  title = 'Select Time',
  time,
  onSelect,
}) => {
  const { card, text, textMuted, primary, surface, border } = useTheme();

  const parsed = parseReminderTime(time);
  const initialPeriod: Period = parsed.hour >= 12 ? 'PM' : 'AM';
  const initialHour12 = parsed.hour % 12 === 0 ? 12 : parsed.hour % 12;

  const [hour12, setHour12] = useState<number>(initialHour12);
  const [minute, setMinute] = useState<number>(parsed.minute);
  const [period, setPeriod] = useState<Period>(initialPeriod);

  useEffect(() => {
    const next = parseReminderTime(time);
    setPeriod(next.hour >= 12 ? 'PM' : 'AM');
    setHour12(next.hour % 12 === 0 ? 12 : next.hour % 12);
    setMinute(next.minute);
  }, [time]);

  const to24Hour = (h12: number, p: Period): number => {
    if (p === 'AM') {
      return h12 === 12 ? 0 : h12;
    }
    return h12 === 12 ? 12 : h12 + 12;
  };

  const previewTimeString = toTimeString(to24Hour(hour12, period), minute);

  const handleSave = () => {
    haptics.success();
    onSelect(previewTimeString);
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheet
      bottomSheetRef={sheetRef}
      snapPoints={['56%']}
      backgroundStyle={{ backgroundColor: card }}
      title={
        <View style={styles.header}>
          <Ionicons name="time-outline" color={text} size={20} />
          <ThemedText type="subtitle" style={{ color: text }}>
            {title}
          </ThemedText>
        </View>
      }
    >
      <View style={styles.timePickerContainer}>
        <View style={[styles.previewBanner, { backgroundColor: surface, borderColor: border }]}>
          <ThemedText style={[styles.previewCaption, { color: textMuted }]}>
            Selected time
          </ThemedText>
          <ThemedText style={[styles.previewValue, { color: primary }]}>
            {formatReminderTime(previewTimeString)}
          </ThemedText>
        </View>

        <View style={styles.columnsRow}>
          <View style={styles.column}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>Hour</ThemedText>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.wheel, { backgroundColor: surface, borderColor: border }]}
              contentContainerStyle={styles.wheelContent}
            >
              {HOURS_12.map(h => {
                const selected = h === hour12;
                return (
                  <HapticButton
                    key={h}
                    accessibilityRole="button"
                    accessibilityLabel={`Hour ${h}`}
                    accessibilityState={{ selected }}
                    onPress={() => setHour12(h)}
                    style={[
                      styles.wheelItem,
                      selected && { backgroundColor: primary + '22' },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.wheelItemText,
                        {
                          color: selected ? primary : text,
                          fontWeight: selected ? '700' : '500',
                        },
                      ]}
                    >
                      {h}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.column}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>Minute</ThemedText>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.wheel, { backgroundColor: surface, borderColor: border }]}
              contentContainerStyle={styles.wheelContent}
            >
              {MINUTES.map(m => {
                const selected = m === minute;
                const label = String(m).padStart(2, '0');
                return (
                  <HapticButton
                    key={m}
                    accessibilityRole="button"
                    accessibilityLabel={`Minute ${label}`}
                    accessibilityState={{ selected }}
                    onPress={() => setMinute(m)}
                    style={[
                      styles.wheelItem,
                      selected && { backgroundColor: primary + '22' },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.wheelItemText,
                        {
                          color: selected ? primary : text,
                          fontWeight: selected ? '700' : '500',
                        },
                      ]}
                    >
                      {label}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.periodColumn}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>AM / PM</ThemedText>
            <View style={styles.periodWrap}>
              {PERIODS.map(p => {
                const selected = p === period;
                return (
                  <HapticButton
                    key={p}
                    accessibilityRole="button"
                    accessibilityLabel={p}
                    accessibilityState={{ selected }}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor: selected ? primary : surface,
                        borderColor: selected ? primary : border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.periodText,
                        { color: selected ? '#FFFFFF' : text },
                      ]}
                    >
                      {p}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </View>
          </View>
        </View>

        <HapticButton
          accessibilityRole="button"
          accessibilityLabel="Save reminder time"
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: primary }]}
        >
          <ThemedText style={styles.saveButtonText}>Save Time</ThemedText>
        </HapticButton>
      </View>
    </BottomSheet>
  );
};

type ItemReminderSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title?: string;
  existingDateTime?: string | null;
  onSchedule: (date: Date) => void;
  onRemove?: () => void;
};

export const ItemReminderSheet: React.FC<ItemReminderSheetProps> = ({
  sheetRef,
  title = 'Set Reminder',
  existingDateTime,
  onSchedule,
  onRemove,
}) => {
  const { card, text, textMuted, primary, surface, border } = useTheme();

  const upcomingDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, idx) => {
        const d = dayjs().add(idx, 'day').startOf('day');
        return {
          key: d.format('YYYY-MM-DD'),
          label: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.format('ddd, MMM D'),
          date: d,
        };
      }),
    [],
  );

  const getInitialState = () => {
    const base =
      existingDateTime && dayjs(existingDateTime).isAfter(dayjs())
        ? dayjs(existingDateTime)
        : dayjs().add(1, 'hour').second(0).millisecond(0);
    const h24 = base.hour();
    return {
      dateKey: base.format('YYYY-MM-DD'),
      hour12: h24 % 12 === 0 ? 12 : h24 % 12,
      minute: base.minute(),
      period: (h24 >= 12 ? 'PM' : 'AM') as Period,
    };
  };

  const initial = getInitialState();
  const [dateKey, setDateKey] = useState<string>(initial.dateKey);
  const [hour12, setHour12] = useState<number>(initial.hour12);
  const [minute, setMinute] = useState<number>(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);

  useEffect(() => {
    const next = getInitialState();
    setDateKey(next.dateKey);
    setHour12(next.hour12);
    setMinute(next.minute);
    setPeriod(next.period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingDateTime]);

  const to24Hour = (h12: number, p: Period): number => {
    if (p === 'AM') return h12 === 12 ? 0 : h12;
    return h12 === 12 ? 12 : h12 + 12;
  };

  const buildSelectedDate = (): Date => {
    const h24 = to24Hour(hour12, period);
    return dayjs(dateKey)
      .hour(h24)
      .minute(minute)
      .second(0)
      .millisecond(0)
      .toDate();
  };

  const applyPreset = (target: dayjs.Dayjs) => {
    haptics.selection();
    const h24 = target.hour();
    setDateKey(target.format('YYYY-MM-DD'));
    setHour12(h24 % 12 === 0 ? 12 : h24 % 12);
    setMinute(target.minute());
    setPeriod(h24 >= 12 ? 'PM' : 'AM');
  };

  const handleConfirm = () => {
    const selectedDate = buildSelectedDate();
    if (selectedDate.getTime() <= Date.now()) {
      haptics.error();
      toast('Please select a future time');
      return;
    }
    haptics.success();
    onSchedule(selectedDate);
    sheetRef.current?.dismiss();
  };

  const handleRemove = () => {
    haptics.selection();
    onRemove?.();
    sheetRef.current?.dismiss();
  };

  const previewDate = dayjs(buildSelectedDate());

  return (
    <BottomSheet
      bottomSheetRef={sheetRef}
      snapPoints={['72%']}
      backgroundStyle={{ backgroundColor: card }}
      title={
        <View style={styles.header}>
          <Ionicons name="notifications-outline" color={text} size={20} />
          <ThemedText type="subtitle" style={{ color: text }}>
            {title}
          </ThemedText>
        </View>
      }
    >
      <View style={styles.timePickerContainer}>
        <View style={styles.presetsRow}>
          <HapticButton
            onPress={() => applyPreset(dayjs().add(1, 'hour').second(0))}
            style={[styles.presetChip, { backgroundColor: surface, borderColor: border }]}
          >
            <ThemedText style={[styles.presetText, { color: text }]}>In 1 hr</ThemedText>
          </HapticButton>
          <HapticButton
            onPress={() => {
              const tonight = dayjs().hour(20).minute(0).second(0);
              applyPreset(tonight.isAfter(dayjs()) ? tonight : tonight.add(1, 'day'));
            }}
            style={[styles.presetChip, { backgroundColor: surface, borderColor: border }]}
          >
            <ThemedText style={[styles.presetText, { color: text }]}>Tonight 8 PM</ThemedText>
          </HapticButton>
          <HapticButton
            onPress={() => applyPreset(dayjs().add(1, 'day').hour(9).minute(0).second(0))}
            style={[styles.presetChip, { backgroundColor: surface, borderColor: border }]}
          >
            <ThemedText style={[styles.presetText, { color: text }]}>Tomorrow 9 AM</ThemedText>
          </HapticButton>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
          style={styles.dateScroll}
        >
          {upcomingDays.map(d => {
            const selected = d.key === dateKey;
            return (
              <HapticButton
                key={d.key}
                onPress={() => setDateKey(d.key)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: selected ? primary : surface,
                    borderColor: selected ? primary : border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dateChipText,
                    { color: selected ? '#FFFFFF' : text },
                  ]}
                >
                  {d.label}
                </ThemedText>
              </HapticButton>
            );
          })}
        </ScrollView>

        <View style={styles.columnsRow}>
          <View style={styles.column}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>Hour</ThemedText>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.wheel, { backgroundColor: surface, borderColor: border }]}
              contentContainerStyle={styles.wheelContent}
            >
              {HOURS_12.map(h => {
                const selected = h === hour12;
                return (
                  <HapticButton
                    key={h}
                    onPress={() => setHour12(h)}
                    style={[styles.wheelItem, selected && { backgroundColor: primary + '22' }]}
                  >
                    <ThemedText
                      style={[
                        styles.wheelItemText,
                        { color: selected ? primary : text, fontWeight: selected ? '700' : '500' },
                      ]}
                    >
                      {h}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.column}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>Minute</ThemedText>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.wheel, { backgroundColor: surface, borderColor: border }]}
              contentContainerStyle={styles.wheelContent}
            >
              {MINUTES.map(m => {
                const selected = m === minute;
                const label = String(m).padStart(2, '0');
                return (
                  <HapticButton
                    key={m}
                    onPress={() => setMinute(m)}
                    style={[styles.wheelItem, selected && { backgroundColor: primary + '22' }]}
                  >
                    <ThemedText
                      style={[
                        styles.wheelItemText,
                        { color: selected ? primary : text, fontWeight: selected ? '700' : '500' },
                      ]}
                    >
                      {label}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.periodColumn}>
            <ThemedText style={[styles.columnHeader, { color: textMuted }]}>AM / PM</ThemedText>
            <View style={styles.periodWrap}>
              {PERIODS.map(p => {
                const selected = p === period;
                return (
                  <HapticButton
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor: selected ? primary : surface,
                        borderColor: selected ? primary : border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.periodText, { color: selected ? '#FFFFFF' : text }]}
                    >
                      {p}
                    </ThemedText>
                  </HapticButton>
                );
              })}
            </View>
          </View>
        </View>

        <View style={[styles.previewBanner, { backgroundColor: surface, borderColor: border }]}>
          <ThemedText style={[styles.previewCaption, { color: textMuted }]}>
            Scheduled for
          </ThemedText>
          <ThemedText style={[styles.previewValue, { color: primary }]}>
            {previewDate.format('MMM D, h:mm A')}
          </ThemedText>
        </View>

        <View style={styles.actionsRow}>
          {existingDateTime && onRemove && (
            <HapticButton
              onPress={handleRemove}
              style={[styles.removeButton, { borderColor: '#EF4444' }]}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
            </HapticButton>
          )}
          <HapticButton
            onPress={handleConfirm}
            style={[styles.saveButton, styles.flexButton, { backgroundColor: primary }]}
          >
            <ThemedText style={styles.saveButtonText}>
              {existingDateTime ? 'Update Reminder' : 'Set Reminder'}
            </ThemedText>
          </HapticButton>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayList: {
    gap: 8,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayLabel: {
    fontSize: 15,
  },
  timePickerContainer: {
    flex: 1,
    gap: 14,
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewCaption: {
    fontSize: 13,
    fontWeight: '500',
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 10,
    height: 170,
  },
  column: {
    flex: 1,
    gap: 6,
  },
  periodColumn: {
    width: 86,
    gap: 6,
  },
  columnHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  wheel: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
  },
  wheelContent: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 4,
  },
  wheelItem: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    fontSize: 15,
  },
  periodWrap: {
    flex: 1,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveButton: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexButton: {
    flex: 1,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateScroll: {
    maxHeight: 38,
  },
  dateRow: {
    gap: 8,
    alignItems: 'center',
  },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  removeButton: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
