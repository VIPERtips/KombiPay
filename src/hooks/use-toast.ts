import Toast from 'react-native-toast-message';

export function useToast() {
  return {
    toast: {
      success: (msg: string) =>
        Toast.show({ type: 'success', text1: msg }),
      error: (msg: string) =>
        Toast.show({ type: 'error', text1: msg }),
    },
  };
}
