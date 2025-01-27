import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base'
import { FontAwesome } from '@expo/vector-icons'; // or react-native-vector-icons

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { DismissKeyboardView } from '@components/DismissKeyboardView'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@hooks/useAuth'
import { useState } from 'react'
import { AppError } from '@utils/AppError'
import { TOAST_DEFAULT } from '@utils/constants'
import { AuthNavigatorRoutesProps } from 'src/routes/auth.routes'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const toast = useToast()
  const { signIn, isLoading, signInWithGoogle } = useAuth(); // Now includes signInWithGoogle


  function handleNavigateToSignUp() {
    navigation.navigate('signUp')
  }

  async function handleSignIn() {
    try {
      await signIn({ email, password })
    } catch (error) {
      const isAppError = error instanceof AppError

      if (isAppError) {
        return toast.show({
          description: isAppError ? error.message : TOAST_DEFAULT.description,
          bgColor: 'red.500',
          ...TOAST_DEFAULT,
        })
      }
    }
  }

  return (
    <DismissKeyboardView>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px={'10'}>
          <Image
            source={BackgroundImg}
            alt=""
            resizeMode="contain"
            position="absolute"
          />
          <Center mt={24} mb={16}>
            <LogoSvg />
            <Text fontSize="sm" color="gray.100" lineHeight={'sm'}>
              Strengthen your mind and body
            </Text>
          </Center>
          <Center>
            <Heading
              color="gray.100"
              fontSize="xl"
              mb={6}
              fontFamily="heading"
              lineHeight={'xl'}
            >
              Access your account
            </Heading>
          </Center>
          <VStack space={4}>
            <Input
              placeholder="Email"
              inputMode="email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              returnKeyType="send"
              onSubmitEditing={handleSignIn}
            />
          </VStack>
          <Center mt={8}>
            <Button
              w={'full'}
              h={14}
              onPress={handleSignIn}
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </Center>
            {/* Google Sign-In Button */}
            <Center mt={4}>
            <Button
              w={'full'}
              h={14}
              variant="outline"
              onPress={signInWithGoogle} // Assuming this function exists in your useAuth hook
              leftIcon={<FontAwesome name="google" size={20} color="red" />}
            >
              Sign in with Google
            </Button>
          </Center>
          
          <VStack
            flex={1}
            justifyContent={'flex-end'}
            mb={'10'}
            alignItems={'center'}
            space={4}
          >
            <Heading color="gray.100" fontSize="md" mt={4} lineHeight={'md'}>
              Don&apos;t have an account?
            </Heading>
            <Button
              w={'full'}
              h={14}
              variant={'outline'}
              onPress={handleNavigateToSignUp}
            >
              Sign up
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </DismissKeyboardView>
  )
}
