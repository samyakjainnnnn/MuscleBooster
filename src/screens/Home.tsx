import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import { api } from 'src/service/api'
import { TOAST_DEFAULT } from '@utils/constants'
import { AppError } from '@utils/AppError'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { GroupDTO } from '@dtos/GroupDTO'
import { Loading } from '@components/Loading'
import { RootStackParamList } from 'src/routes/root.routes'
import { fetchBodyPartList, fetchExercises } from 'src/service/exerciseService'

type ExerciseScreenNavigationProp = NavigationProp<RootStackParamList, "Exercise">;

export function Home() {
  const [bodyPartList, setBodyPartList] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const toast = useToast();

  useEffect(() => {
    fetchBodyParts();
  }, []);

  const fetchBodyParts = async () => {
    try {
      const result = await fetchBodyPartList();
      setBodyPartList(result || []);
    } catch (error) {
      console.error("Error fetching body part list:", error);
      toast.show({
        description: "An error occurred while fetching body part list. Please try again later.",
        bgColor: "red.500",
        ...TOAST_DEFAULT,
      });
    }
  };

  useEffect(() => {
    if (selectedBodyPart) {
      fetchExercisesByBodyPart();
    } else {
      fetchInitialExercises();
    }
  }, [selectedBodyPart]);

  const fetchInitialExercises = async () => {
    try {
      setIsLoading(true);
      const result = await fetchExercises(20, 0);
      setExercises(result || []);
      setOffset(20);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      toast.show({
        description: "An error occurred while fetching exercises. \nPlease try again later.",
        bgColor: "red.500",
        ...TOAST_DEFAULT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExercisesByBodyPart = async () => {
    try {
      setIsLoading(true);
      const result = await fetchExercises(20, 0, undefined, selectedBodyPart || undefined); // Fetch exercises based on selected body part
      setExercises(result || []);
      setOffset(20);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      toast.show({
        description: "An error occurred while fetching exercises. \nPlease try again later.",
        bgColor: "red.500",
        ...TOAST_DEFAULT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreExercises = async () => {
    try {
      const result = await fetchExercises(20, offset, undefined, selectedBodyPart || undefined); // Fetch next set of exercises based on selected body part
      setExercises((prevExercises) => [...prevExercises, ...result]);
      setOffset((prevOffset) => prevOffset + 20);
    } catch (error) {
      console.error("Error fetching more exercises:", error);
      toast.show({
        description: "An error occurred while fetching more exercises. \nPlease try again later.",
        bgColor: "red.500",
        ...TOAST_DEFAULT,
      });
    }
  };

  const handleOpenExercise = (exerciseId: string) => {
    navigation.navigate("Exercise", { exerciseId });
  };
 
  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={bodyPartList}
        keyExtractor={(group) => group}
        horizontal
        showsHorizontalScrollIndicator={false}
        my={10}
        maxH={10}
        _contentContainerStyle={{ px: 8 }}
        renderItem={({ item }) => (
          <Group
            name={item}
            active={selectedBodyPart === item}
            onPress={() => setSelectedBodyPart(item)}
          />
        )}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent={'space-between'} mb={5}>
            <Heading
              color={'gray.200'}
              fontSize={'md'}
              lineHeight={'md'}
              fontFamily={'heading'}
            >
              Exercises
            </Heading>
            <Text color={'gray.200'} fontSize={'sm'}>
              {exercises.length}
            </Text>
          </HStack>
          <FlatList
            data={exercises}
            keyExtractor={(exercise, index) => `${exercise.name}-${index}`}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 8 }}
            renderItem={({ item }) => (
              <ExerciseCard
                description={`${item.series} series - ${item.repetitions} reps`}
                name={item.name}
                image={item.thumb}
                onPress={() => handleOpenExercise(item.id)}
              />
            )}
          />
        </VStack>
      )}
    </VStack>
  )
}
