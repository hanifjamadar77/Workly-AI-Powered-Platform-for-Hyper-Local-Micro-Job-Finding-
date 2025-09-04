import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { images } from "@/constants";

type SearchProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export default function Search({
  placeholder = "Search...",
  value = "",
  onChangeText,
  onPress,
}: SearchProps) {
  const [text, setText] = useState(value);

  const handleChange = (input: string) => {
    setText(input);
    if (onChangeText) onChangeText(input);
  };

  return (
    <View className="flex-row items-center bg-gray-200 p-3 rounded-full m-2 mt-4">
        <TouchableOpacity className="pl-4" onPress={onPress}>
            <Image
                source={images.search}
                className='size-7'
                resizeMode='contain'
                tintColor= '#000000'
            />
        </TouchableOpacity>
      <TextInput
        className="flex-1 px-4 py-2 text-gray-500 text-xl"
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
      />
    </View>
  );
}
