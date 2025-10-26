import React, { Component, useState } from "react";
import { Text, TextInput, View } from "react-native";
import cn from "clsx";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  autoCapitalize = "none",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className="w-full">
      {/* Label */}
      <Text className="text-gray-700 font-semibold mb-1 text-lg">{label}</Text>

      {/* Input */}
      <TextInput
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-gray-50 text-base text-gray-900",
          "focus:border-2 focus:border-blue-500 focus:bg-white",
          isFocused
            ? "border-2 border-blue-500 bg-white"
            : "border border-gray-300"
        )}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#888"
        editable={editable}
      />
    </View>
  );
};

export default CustomInput;
