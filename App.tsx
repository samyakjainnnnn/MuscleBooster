import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import {
  useFonts,
  Roboto_400Regular as Roboto400Regular,
  Roboto_700Bold as Roboto700Bold,
} from '@expo-google-fonts/roboto'
import { Loading } from '@components/Loading'
import { theme } from 'src/theme'
import { AuthContextProvider } from '@contexts/AuthContext'
import { Routes } from 'src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular: Roboto400Regular,
    Roboto_700Bold: Roboto700Bold,
  })

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent={true}
      />
      <AuthContextProvider>
        {!fontsLoaded ? <Loading /> : <Routes />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}
