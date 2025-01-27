import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppError } from '@utils/AppError'
import { TOKEN_STORAGE_PREFIX } from '@utils/constants'

type TokenStorageProps = {
  token: string
  refreshToken: string
}

export async function tokenStorageSave({
  token,
  refreshToken,
}: TokenStorageProps) {
  await AsyncStorage.setItem(
    TOKEN_STORAGE_PREFIX,
    JSON.stringify({ token, refreshToken }),
  )
}

export async function tokenStorageGet(): Promise<TokenStorageProps | null> {
  try {
    const result = await AsyncStorage.getItem(TOKEN_STORAGE_PREFIX)

    console.log('result', result)

    if (result) {
      const { token, refreshToken } = JSON.parse(result)

      return {
        token,
        refreshToken,
      }
    }

    return null
  } catch (error) {
    console.log('Error getting token from storage', error)
    throw new AppError('Error getting token from storage')
  }
}

export async function tokenStorageRemove() {
  await AsyncStorage.removeItem(TOKEN_STORAGE_PREFIX)
}
