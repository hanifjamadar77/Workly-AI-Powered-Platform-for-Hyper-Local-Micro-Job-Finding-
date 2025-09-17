import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { images } from "@/constants";
import { useRouter } from 'expo-router';
import { Keyboard } from "react-native";

type SearchProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onPress?: () => void;
};

export default function Search({
  placeholder = "Search...",
  value = "",
  onChangeText,
  onPress,
  onFocus
}: SearchProps) {
  const [text, setText] = useState(value);

  const handleChange = (input: string) => {
    setText(input);
    if (onChangeText) onChangeText(input);
  };

   const router = useRouter();

  //  const handleFocus = () => {
  //   router.push('/(seeker)/jobs');
  //  }
  return (
    <View className="flex-row items-center bg-gray-200 p-2 rounded-full mx-4 mt-2">
        <TouchableOpacity className="pl-3" onPress={onPress} onFocus={onFocus}>
            <Image
                source={images.search}
                className='size-5'
                resizeMode='contain'
                tintColor= '#000000'
            />
        </TouchableOpacity>
      <TextInput
        onFocus={onFocus}
        className="flex-1 px-4 py-2 text-gray-500 text-base"
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
      />
    </View>
  );
}
