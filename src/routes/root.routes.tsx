import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuth } from '@hooks/useAuth';

export type RootStackParamList = {
  AppRoutes: undefined;
  AuthRoutes: undefined;
  Exercise: { exerciseId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You can render a loading component here
    return null;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="AppRoutes" component={AppRoutes} />
      ) : (
        <RootStack.Screen name="AuthRoutes" component={AuthRoutes} />
      )}
    </RootStack.Navigator>
  );
}
