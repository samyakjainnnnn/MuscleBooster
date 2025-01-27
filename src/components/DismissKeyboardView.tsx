import { TouchableWithoutFeedback, Keyboard } from 'react-native'

export const DismissKeyboardView = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      {children}
    </TouchableWithoutFeedback>
  )
}
