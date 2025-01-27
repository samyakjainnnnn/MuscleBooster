import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base'
import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { DismissKeyboardView } from '@components/DismissKeyboardView'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { GENERAL_ERROR_MESSAGE, TOAST_DEFAULT } from '@utils/constants'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const signUpSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password is too short'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

export function SignUp() {
  const { isLoading, signUp } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(signUpSchema),
  })

  const toast = useToast()

  async function onSubmit(data: Inputs) {
    try {
      await signUp(data)
      toast.show({
        description: `Welcome, ${data.name}!`,
        bgColor: 'green.700',
        ...TOAST_DEFAULT,
      })
    } catch (error) {
      const isAppError = error instanceof AppError

      console.log(error)
      toast.show({
        description: isAppError ? error.message : GENERAL_ERROR_MESSAGE,
        bgColor: 'red.500',
        ...TOAST_DEFAULT,
      })
    }
  }

  const navigation = useNavigation()

  function handleNavigateToSignIn() {
    navigation.goBack()
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
              Create your account
            </Heading>
          </Center>
          <VStack space={4}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Name"
                  inputMode="text"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  inputMode="email"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Confirm password"
                  secureTextEntry
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType="send"
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />
          </VStack>
          <Center mt={8}>
            <Button
              w={'full'}
              h={14}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              Create account
            </Button>
          </Center>
          <VStack
            flex={1}
            justifyContent={'flex-end'}
            mb={'10'}
            alignItems={'center'}
            space={4}
          >
            <Button
              w={'full'}
              h={14}
              variant={'outline'}
              onPress={handleNavigateToSignIn}
            >
              Back to Sign in
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </DismissKeyboardView>
  )
}
