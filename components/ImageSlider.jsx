import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function ImageSlider({
  images,
  autoPlayInterval = 3000,
}) {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * (width - 40),
          animated: true,
        });
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, images, autoPlayInterval]);

  if (!images || images.length === 0) return null;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 40));
    setActiveIndex(index);
  };

  return (
    <View className="my-6 mx-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        className="rounded-lg"
      >
        {images.map((image, index) => (
          <View key={index} className="overflow-hidden rounded-lg mx-2" style={{ width: width - 55 }}>
            <Image
              source={{ uri: image }}
              className="w-full h-60"
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Dots Indicator */}
      <View className="flex-row justify-center mt-3">
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => {
              setActiveIndex(index);
              scrollViewRef.current?.scrollTo({
                x: index * (width - 40),
                animated: true,
              });
            }}
          />
        ))}
      </View>
    </View>
  );
}