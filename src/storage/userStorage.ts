import { UserDTO } from '@dtos/UserDTO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_STORAGE_PREFIX } from 'src/utils/constants'

export async function userStorageSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE_PREFIX, JSON.stringify(user))
}

export async function userStorageGet(): Promise<UserDTO | null> {
  const user = await AsyncStorage.getItem(USER_STORAGE_PREFIX)

  if (!user) {
    return null
  }

  return JSON.parse(user) as UserDTO
}

export async function userStorageRemove() {
  await AsyncStorage.removeItem(USER_STORAGE_PREFIX)
}
