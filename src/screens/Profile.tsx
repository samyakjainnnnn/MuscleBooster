import { Button } from '@components/Button'
import { DismissKeyboardView } from '@components/DismissKeyboardView'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_DEFAULT } from '../utils/constants'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { api } from 'src/service/api'
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'

import { auth, storage } from "@/firebaseConfig"; // Firebase imports
import {
  updateProfile,
  updatePassword,
  User as FirebaseUser,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PHOTO_SIZE = 33
type Inputs = {
  displayName: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
};

const signUpSchema = yup.object({
  displayName: yup.string().required("Name is required"),
  password: yup
    .string()
    .test(
      "minLength",
      "Password must be at least 6 characters long",
      (val) => !val || val.length >= 6
    ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords do not match", function (val) {
      return !this.parent.password || !val || val === this.parent.password;
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const user = auth.currentUser; // Firebase user

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(signUpSchema),
  });

  async function onSubmit(data: Inputs) {
    try {
      setIsUpdating(true);

      // Update display name
      if (user && data.displayName !== user.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      // Update password
      if (user && data.password) {
        await updatePassword(user, data.password);
      }

      toast.show({
        description: "Profile updated successfully.",
        bgColor: "green.500",
      });
    } catch (error) {
      console.error(error);
      toast.show({
        description: "An error occurred. Please try again.",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleUserPhotoChange() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const fileInfo = (await FileSystem.getInfoAsync(result.assets[0].uri, {
        size: true,
      })) as FileSystem.FileInfo & { size: number };

      if (fileInfo.size > 5 * 1024 * 1024) {
        toast.show({
          description: "The image size must be less than 5MB.",
          bgColor: "red.500",
        });
        return;
      }

      // Upload to Firebase Storage
      const fileName = `${user?.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `avatars/${fileName}`);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const photoURL = await getDownloadURL(storageRef);

      if (user) {
        await updateProfile(user, { photoURL });
      }

      toast.show({
        description: "Photo updated successfully.",
        bgColor: "green.500",
      });
    } catch (error) {
      console.error(error);
      toast.show({
        description: "An error occurred while updating the photo.",
        bgColor: "red.500",
      });
    }
  }


  return (
    <DismissKeyboardView>
      <VStack flex={1}>
        <ScreenHeader title="Profile" />
        <ScrollView
          flex={1}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          paddingBottom={36}
        >
          <Center mt={6} px={10} flex={1}>
            <UserPhoto
              size={PHOTO_SIZE}
              alt="Ivan Seibel"
              source={!user?.photoURL ? undefined : { uri: user.photoURL }}
            />
            <TouchableOpacity
              // onPress={handleUserPhotoChange}
              activeOpacity={0.7}
            >
              <Text
                mt={2}
                mb={4}
                fontSize="md"
                color="green.500"
                fontFamily={'heading'}
              >
                Change photo
              </Text>
            </TouchableOpacity>

            <VStack space={4} w={'full'} mb={4}>
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Name"
                    bg={'gray.600'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    errorMessage={errors.displayName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { value } }) => (
                  <Input
                    placeholder="E-mail"
                    bg={'gray.600'}
                    isDisabled
                    isReadOnly
                    value={value}
                  />
                )}
              />
            </VStack>
            <VStack space={4} w={'full'} flex={1} justifyContent={'flex-end'}>
              <Heading
                size="md"
                color="gray.200"
                lineHeight={'md'}
                fontFamily={'heading'}
              >
                Change password
              </Heading>
              <Controller
                control={control}
                name="oldPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Old password"
                    bg={'gray.600'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    type={'password'}
                    value={value}
                    errorMessage={errors.oldPassword?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Password"
                    bg={'gray.600'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    type={'password'}
                    value={value}
                    errorMessage={errors.password?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Confirm password"
                    bg={'gray.600'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    type={'password'}
                    value={value}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />
              <Button
                mt={4}
                mb={8}
                w={'full'}
                h={14}
                variant={'solid'}
                onPress={handleSubmit(onSubmit)}
                isLoading={isUpdating}
              >
                Save
              </Button>
            </VStack>
          </Center>
        </ScrollView>
      </VStack>
    </DismissKeyboardView>
  )
}
