import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/Loading';
import { RootRoutes } from './root.routes';
import { Box, useTheme } from 'native-base';

export function Routes() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.gray[700],
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <RootRoutes />
      </NavigationContainer>
    </Box>
  );
}
