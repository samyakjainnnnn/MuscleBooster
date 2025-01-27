import { IPressableProps, Pressable, Text } from 'native-base'

type GroupProps = IPressableProps & {
  name: string
  active?: boolean
}

export function Group({ name, active = false, ...rest }: GroupProps) {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg={'gray.600'}
      rounded="4px"
      justifyContent={'center'}
      alignItems={'center'}
      overflow={'hidden'}
      borderWidth={active ? 1 : 0}
      borderColor={'green.700'}
      {...rest}
    >
      <Text
        color={active ? 'green.700' : 'gray.200'}
        textTransform={'uppercase'}
        fontSize={'xs'}
        lineHeight={'xs'}
        fontWeight={'bold'}
      >
        {name}
      </Text>
    </Pressable>
  )
}
