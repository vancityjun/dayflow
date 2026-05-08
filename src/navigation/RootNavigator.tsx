import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { PreviewCatalogScreen } from '../dev-preview/PreviewCatalogScreen';
import { PreviewScenarioScreen } from '../dev-preview/PreviewScenarioScreen';
import { AIScheduleScreen } from '../screens/AIScheduleScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF8F4' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateTask" component={TaskFormScreen} />
      <Stack.Screen name="EditTask" component={TaskFormScreen} />
      <Stack.Screen name="AISchedule" component={AIScheduleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {__DEV__ ? <Stack.Screen name="PreviewCatalog" component={PreviewCatalogScreen} /> : null}
      {__DEV__ ? <Stack.Screen name="PreviewScenario" component={PreviewScenarioScreen} /> : null}
    </Stack.Navigator>
  );
}
