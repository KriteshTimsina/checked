import { BaseToast, ToastProps } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';

export const toastConfig = {
  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text}
      text1NumberOfLines={1}
      renderLeadingIcon={undefined}
      renderTrailingIcon={undefined}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 0,
    height: 48,
    backgroundColor: '#111111',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    minWidth: 100,
    maxWidth: '80%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'ClashGroteskMedium',
    color: '#ffffff',
    textAlign: 'center',
  },
});
