import { tokenStorageGet, tokenStorageSave } from '@storage/tokenStorage'
import { AppError } from '@utils/AppError'
import axios, { AxiosError, AxiosInstance } from 'axios'

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

type PromiseType = {
  onSuccess: (token: string) => void
  onError: (error: AxiosError) => void
}

const api = axios.create({
  baseURL: 'http://10.10.127.117:3333',
}) as APIInstanceProps

// Implements a queue for the requests failed due to token expiration
let failedQueue: PromiseType[] = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (responseError) => {
      if (responseError?.response?.status === 401) {
        if (
          ['token.expired', 'token.invalid'].includes(
            responseError.response.data?.message,
          )
        ) {
          const tokenObject = await tokenStorageGet()

          if (!tokenObject?.refreshToken) {
            signOut()
            return Promise.reject(responseError)
          }

          const originalRequestConfig = responseError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token) => {
                  originalRequestConfig.headers.Authorization = `Bearer ${token}`
                  resolve(api(originalRequestConfig))
                },
                onError: (error) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          return new Promise((resolve, reject) => {
            try {
              api
                .post('sessions/refresh-token', {
                  refresh_token: tokenObject.refreshToken,
                })
                .then(async (response) => {
                  const data = response.data

                  await tokenStorageSave({
                    token: data.token,
                    refreshToken: data.refresh_token,
                  })

                  if (originalRequestConfig.data) {
                    originalRequestConfig.data = JSON.parse(
                      originalRequestConfig.data,
                    )
                  }

                  originalRequestConfig.headers.Authorization = `Bearer ${data.token}`
                  api.defaults.headers.common.Authorization = `Bearer ${data.token}`

                  failedQueue.forEach((request) => {
                    request.onSuccess(data.token)
                  })

                  console.log('Retrying requests...')

                  resolve(api(originalRequestConfig))
                })

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onError(error)
              })

              signOut()
              reject(error)
            } finally {
              isRefreshing = false
              failedQueue = []
            }
          })
        }

        signOut()
      }

      if (responseError.response && responseError.response.data) {
        return Promise.reject(new AppError(responseError.response.data.message))
      } else {
        return Promise.reject(responseError)
      }
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
