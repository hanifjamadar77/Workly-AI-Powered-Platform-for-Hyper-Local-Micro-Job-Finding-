import React, { Component } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import cn from "clsx";

const CustomButton = ({
  onPress,
  title = "Click me",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`
    w-full flex flex-row items-center justify-center 
    p-4 rounded-2xl
    ${isLoading ? "bg-blue-300" : "bg-blue-500"}
    shadow-md active:opacity-80
  `}
      style={style}
    >
      {leftIcon && <View className="mr-2">{leftIcon}</View>}

      <View className="flex flex-row items-center justify-center">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            className="text-white text-base font-semibold tracking-wide"
            style={textStyle}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
