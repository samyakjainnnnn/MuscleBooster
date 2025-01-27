import axios from "axios";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

const exerciseDBAPI = axios.create({
  baseURL: "https://exercisedb.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    "x-rapidapi-key": "e759d7e7f4msh42d8c792d42f109p1b000djsn890c20afaf68",
  },
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchExercises = async (limit: number = 10, offset: number = 0, retries: number = 3, bodyPart?: string) => {
  for (let i = 0; i < retries; i++) {
    try {
      const params: Record<string, any> = { limit, offset };
      const url = bodyPart 
        ? `/exercises/bodyPart/${bodyPart}`
        : '/exercises';

      const response = await exerciseDBAPI.get(url, { params });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching exercises (attempt ${i + 1}):`, error);
      if (i < retries - 1) {
        const retryAfter = error.response?.headers['retry-after']
          ? parseInt(error.response.headers['retry-after'], 10) * 1000
          : Math.pow(2, i) * 1000; // Exponential backoff
        console.warn(`Retrying in ${retryAfter}ms...`);
        await delay(retryAfter);
      } else {
        throw error;
      }
    }
  }
};

// Function to fetch exercise details by ID
export const fetchExerciseDetails = async (exerciseId: string): Promise<ExerciseDTO | null> => {
  try {
    const response = await exerciseDBAPI.get(`/exercises/exercise/${exerciseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise details for ${exerciseId}:`, error);
    return null;
  }
};

// Function to fetch body part list
export const fetchBodyPartList = async (): Promise<string[]> => {
  try {
    const response = await exerciseDBAPI.get(`/exercises/bodyPartList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching body part list:", error);
    throw error;
  }
};

// Function to fetch exercise details by name
export const fetchExerciseByName = async (name: string, limit: number = 10, offset: number = 0): Promise<ExerciseDTO[]> => {
  try {
    const response = await exerciseDBAPI.get(`/exercises/name/${name}`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises by name "${name}":`, error);
    throw error;
  }
};

export { exerciseDBAPI };
 