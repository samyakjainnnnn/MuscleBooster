import { FormControl, Input as NativeBaseInput } from 'native-base'

type InputProps = React.ComponentProps<typeof NativeBaseInput> & {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: InputProps) {
  const inputIsInvalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={inputIsInvalid}>
      <FormControl.ErrorMessage m={0} color={'red.600'}>
        {errorMessage}
      </FormControl.ErrorMessage>
      <NativeBaseInput
        bg="gray.650"
        h={14}
        px={4}
        borderWidth={0}
        fontSize={'md'}
        color={'white'}
        fontFamily={'body'}
        placeholderTextColor={'gray.300'}
        rounded={'6px'}
        _invalid={{
          borderColor: 'red.600',
          borderWidth: 1,
        }}
        _focus={{
          bg: 'gray.650',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest}
      />
    </FormControl>
  )
}
