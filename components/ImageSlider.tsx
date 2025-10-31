import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 40; // 20px padding on each side

interface ImageSliderProps {
  images: string[];
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoPlayInterval = 3000,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Auto-slide logic (corrected)
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * IMAGE_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, images, autoPlayInterval]);

  // ✅ Handle manual scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setCurrentIndex(index);
  };

  // ✅ Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * IMAGE_WIDTH,
      animated: true,
    });
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(nextIndex);
  };

  if (!images || images.length === 0) return null;

  return (
    <View className="my-4">
      {/* Slider Container */}
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          // contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {images.map((image, index) => (
            <View
              key={index}
              className="overflow-hidden rounded-2xl mx-2"
              style={{ width: IMAGE_WIDTH - 10 }}
            >
              <Image
                source={{ uri: image }}
                className="w-full h-64"
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Previous Button */}
        <TouchableOpacity
          onPress={goToPrevious}
          className="absolute left-6 top-1/2 -mt-5 bg-white/90 p-2 rounded-full shadow-lg"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          onPress={goToNext}
          className="absolute right-6 top-1/2 -mt-5 bg-white/90 p-2 rounded-full shadow-lg"
        >
          <Ionicons name="chevron-forward" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Image Counter */}
        <View className="absolute top-4 right-6 bg-black/60 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>

      {/* Dots Navigation */}
      <View className="flex-row justify-center items-center gap-2 mt-4">
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            className={`rounded-full ${
              index === currentIndex
                ? "w-8 h-3 bg-blue-600"
                : "w-3 h-3 bg-gray-300"
            }`}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;
