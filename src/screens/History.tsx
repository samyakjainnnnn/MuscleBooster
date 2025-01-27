import { HistoryCard } from '@components/HistoryCard'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryDTO } from '@dtos/HistoryDTO'
import { useFocusEffect } from '@react-navigation/native'
import { AppError } from '@utils/AppError'
import { TOAST_DEFAULT } from '@utils/constants'
import {
  VStack,
  SectionList,
  Heading,
  Text,
  useToast,
  Center,
} from 'native-base'
import { useCallback, useState } from 'react'
import { api } from 'src/service/api'

// type Exercise = {
//   group: string
//   name: string
//   time: string
// }

// type ExerciseHistorySectionList = {
//   title: string
//   data: Exercise[]
// }

const exercises: HistoryDTO[] = [
  {
    title: '26.08.2021',
    data: [
      {
        group: 'Back bla bla bla bla bla blaoidhjfaoifjd asdoifhjaosdfij',
        name: 'Front pulldown aoiuhoasdifhj adofijaosdifjaos asodifjaosdifj aodifjaodifj',
        hour: '07:30',
        created_at: '2021-08-26T07:30:00.000Z',
        exercise_id: '1',
        id: '1',
        user_id: '1',
      },
      {
        group: 'Chest',
        name: 'Bench press',
        hour: '08:30',
        created_at: '2021-08-26T08:30:00.000Z',
        exercise_id: '2',
        id: '2',
        user_id: '1',
      },
    ],
  },
  {
    title: '27.08.2021',
    data: [
      {
        group: 'Back',
        name: 'Front pulldown',
        hour: '07:30',
        created_at: '2021-08-27T07:30:00.000Z',
        exercise_id: '3',
        id: '3',
        user_id: '1',
      },
      {
        group: 'Chest',
        name: 'Bench press',
        hour: '08:30',
        created_at: '2021-08-27T08:30:00.000Z',
        exercise_id: '4',
        id: '4',
        user_id: '1',
      },
    ],
  },
  {
    title: '28.08.2021',
    data: [
      {
        group: 'Back',
        name: 'Front pulldown',
        hour: '07:30',
        created_at: '2021-08-28T07:30:00.000Z',
        exercise_id: '5',
        id: '5',
        user_id: '1',
      },
      {
        group: 'Chest',
        name: 'Bench press',
        hour: '08:30',
        created_at: '2021-08-28T08:30:00.000Z',
        exercise_id: '6',
        id: '6',
        user_id: '1',
      },
    ],
  },
]

export function History() {
  const [history, setHistory] = useState<HistoryDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  useFocusEffect(
    useCallback(
      () => {
        async function fetchExercises() {
          try {
            setIsLoading(true)
            const response = await api.get('/history')

            setHistory(response.data)

            console.table(response.data)
          } catch (error) {
            const isAppError = error instanceof AppError

            if (isAppError) {
              return toast.show({
                description: isAppError
                  ? error.message
                  : 'An error occurred while listing the exercises. \nPlease try again later.',
                bgColor: 'red.500',
                ...TOAST_DEFAULT,
              })
            }
          } finally {
            setIsLoading(false)
          }
        }

        fetchExercises()
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise History" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={history}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => <HistoryCard {...item} />}
          px={8}
          ListEmptyComponent={() => (
            <Center width={'100%'} mt={8}>
              <Text
                color={'gray.100'}
                fontSize={'md'}
                lineHeight={'md'}
                textAlign={'center'}
                width={'80%'}
              >
                Your fitness journey awaits - let&apos;s start logging those
                workouts!
              </Text>
            </Center>
          )}
          contentContainerStyle={
            exercises.length === 0 && {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }
          }
          renderSectionHeader={({ section: { title } }) => (
            <Heading
              color={'gray.200'}
              fontSize={'md'}
              lineHeight={'md'}
              mt={10}
              mb={3}
            >
              {title}
            </Heading>
          )}
        />
      )}
    </VStack>
  )
}
