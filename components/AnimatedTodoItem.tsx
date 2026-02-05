import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';

interface AnimatedTodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}

export function AnimatedTodoItem({
  todo,
  onToggle,
  onPress,
  onDelete,
  index,
}: AnimatedTodoItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(todo.completed ? 0.7 : 1);

  useEffect(() => {
    opacity.value = withTiming(todo.completed ? 0.7 : 1, { duration: 200 });
  }, [todo.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handleToggle = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 50).springify()}
      exiting={SlideOutLeft.springify()}
      style={animatedStyle}
    >
      <TodoItem
        todo={todo}
        onToggle={handleToggle}
        onPress={onPress}
        onDelete={onDelete}
      />
    </Animated.View>
  );
}
