import { IToastProps } from 'native-base'

export const TOAST_DEFAULT: IToastProps = {
  placement: 'top',
  _description: {
    fontFamily: 'body',
    fontSize: 'md',
  },
}

export const GENERAL_ERROR_MESSAGE =
  'An error occurred while processing your request. \nPlease try again later.'

export const USER_STORAGE_PREFIX = '@FitTrackPro:user'
export const TOKEN_STORAGE_PREFIX = '@FitTrackPro:token'
