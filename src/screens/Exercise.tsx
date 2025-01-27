import {
  HStack,
  Heading,
  Icon,
  VStack,
  Text,
  Image,
  ScrollView,
  useToast,
  Box,
} from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'


import { Button } from '@components/Button'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { useEffect, useState } from 'react'
import { api } from 'src/service/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'
import { AppError } from '@utils/AppError'
import { TOAST_DEFAULT } from '@utils/constants'
import { fetchExerciseDetails } from 'src/service/exerciseService'

type RouteParams = {
  exerciseId: string
}

export function Exercise() {
  const [isMarkingAsCompleted, setIsMarkingAsCompleted] = useState(false)

  const toast = useToast()
  const route = useRoute()


  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO | null>(null);
  const navigation = useNavigation();

  const { exerciseId } = route.params as RouteParams;

 

  function handleGoBack() {
    navigation.goBack()
  }


  async function handleMarkAsCompleted() {
    try {
      setIsMarkingAsCompleted(true)

      const response = await api.post(`/history/`, {
        exercise_id: exerciseId,
      })

      if (response.status === 201) {
        toast.show({
          description: 'Exercise marked as completed!',
          bgColor: 'green.700',
          ...TOAST_DEFAULT,
        })
      }

     
    } catch (error) {
      const isAppError = error instanceof AppError

      if (isAppError) {
        return toast.show({
          description: isAppError
            ? error.message
            : 'An error occurred while marking the exercise as completed. \nPlease try again later.',
          bgColor: 'red.500',
          ...TOAST_DEFAULT,
        })
      }
    } finally {
      setIsMarkingAsCompleted(false)
    }
  }

  useEffect(() => {
    if (!exerciseId) {
      return
    }

    async function fetchExerciseData() {
      try {
        setIsLoading(true);
        const exerciseDetails = await fetchExerciseDetails(exerciseId);
        setExercise(exerciseDetails);
      } catch (error) {
        console.error("Error loading exercise data:", error);
        toast.show({
          description:
            "An error occurred while fetching exercise data. Please try again later.",
          bgColor: "red.500",
          ...TOAST_DEFAULT,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchExerciseData();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg={'gray.600'} pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <VStack w={10} h={10} justifyContent={'center'}>
            <Icon as={Feather} name="arrow-left" size={6} color="green.500" />
          </VStack>
        </TouchableOpacity>

        {isLoading ? (
          <Loading />
        ) : (
          <HStack justifyContent={'space-between'} mt={3} mb={5} space={2}>
            <Heading
              color={'gray.100'}
              fontSize={'lg'}
              lineHeight={'lg'}
              fontFamily={'heading'}
              flexShrink={1}
            >
              {exercise?.name}
            </Heading>
            <HStack alignItems={'center'}>
              <BodySvg width={18} height={18} />
              <Text
                color="gray.200"
                fontSize={'md'}
                lineHeight={'md'}
                ml={1}
                textTransform="capitalize"
              >
                {exercise?.group}
              </Text>
            </HStack>
          </HStack>
        )}
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          pb={4}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack flex={1} p={8} space={3}>
            <Box rounded={'md'} overflow={'hidden'}>
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
                }}
                alt="Exercise demo"
                w={'full'}
                h={'364px'}
                resizeMode="cover"
              />
            </Box>

            <VStack
              pt={4}
              pb={4}
              px={2}
              space={6}
              bg={'gray.600'}
              rounded={'md'}
            >
              <HStack justifyContent={'center'} space={16}>
                <HStack space={2}>
                  <SeriesSvg width={24} height={24} />
                  <Text color={'gray.200'} fontSize={'md'} lineHeight={'md'}>
                    {exercise?.series} series
                  </Text>
                </HStack>
                <HStack space={2}>
                  <RepetitionsSvg width={24} height={24} />
                  <Text color={'gray.200'} fontSize={'md'} lineHeight={'md'}>
                    {exercise?.repetitions} reps
                  </Text>
                </HStack>
              </HStack>

              <Button
                w={'full'}
                h={14}
                onPress={handleMarkAsCompleted}
                isLoading={isMarkingAsCompleted}
              >
                Mark as completed
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}
