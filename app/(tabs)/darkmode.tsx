import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/theme-context';

export default function DarkMode() {
  const insets = useSafeAreaInsets();
  const { darkMode } = useTheme();
  
  return (
    <View 
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingTop: insets.top,
        backgroundColor: darkMode ? '#1E293B' : '#F2F7FB'
      }}
    >
      <Text style={{ color: darkMode ? '#93C5FD' : '#1E3A64', fontSize: 18 }}>
        {darkMode ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
      </Text>
    </View>
  );
} 