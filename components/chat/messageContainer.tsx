import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Markdown from 'react-native-markdown-display';
import Feather from '@expo/vector-icons/Feather';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/styles/prism';
import { Audio } from 'expo-av';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { MessageInterface } from '@/app/types/interface';
import { markdownStyles } from './markdownStyle';
import { CopyToClipboard, RemoveMarkdown } from '@/app/utils/scripts';

type MessageProps = {
  msg: MessageInterface;
  isInputFocus: boolean;
  msgSize: number;
  index: number;
  isPlaying: boolean;
  isLoading: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  soundInstance: Audio.Sound;
  setSoundInstance: React.Dispatch<React.SetStateAction<Audio.Sound | null | undefined>>;
  speak: (text: string) => Promise<void>;
};

export const MessageContainer = ({
  speak,
  isLoading,
  soundInstance,
  isPlaying,
  setIsPlaying,
  index,
  msg,
  msgSize,
  isInputFocus,
}: MessageProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  const stopPlaying = () => {
    soundInstance?.stopAsync();
    setIsPlaying(false);
  };

 

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY }],
  };

  if (msg.role === 'assistant') {
    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{
            padding: 12,
            marginBottom: msgSize === index + 1 && isInputFocus ? 20 : 5,
          }}
        >
          <View style={styles.internalAiMessage}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/logos/transparent/8.png')}
            />
            <MarkdownContent content={msg.content} />
          </View>
          {msgSize === index + 1 && (
            <View style={styles.bottomOptions}>
              {isLoading ? (
                <ActivityIndicator color={'orange'} />
              ) : isPlaying ? (
                <MaterialCommunityIcons
                  onPress={() => stopPlaying()}
                  name="square-rounded"
                  size={24}
                  color="#cbcbcb"
                />
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    const text = RemoveMarkdown(msg.content);
                    speak(text);
                  }}
                >
                  <Feather name="volume-2" size={24} color="#cbcbcb" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={async () => {
                  const text = RemoveMarkdown(msg.content);
                  if (text) {
                    await CopyToClipboard(text);
                  }
                }}
              >
                <Ionicons name="copy" size={20} color="#cbcbcb" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="refresh-ccw" size={20} color="#cbcbcb" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  } else if (msg.role === 'user') {
    return (
      <Animated.View style={animatedStyle}>
        <View style={styles.messageUser}>
          <View style={styles.internalUserMessage}>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        </View>
      </Animated.View>
    );
  } else {
    return null;
  }
};

const MarkdownContent = ({ content }: { content: string }) => {
  return (
    <Markdown
      style={markdownStyles as any}
      rules={{
        fence: (node) => {
          const language = (node as any)?.sourceInfo || 'javascript';
          const code = node.content;

          return (
            <>
              <View
                style={{
                  padding: 6,
                  backgroundColor: '#212121',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 10,
                  width: '100%',
                }}
              >
                <Text style={{ color: 'white' }}>{language}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    const text = RemoveMarkdown(code);
                    await CopyToClipboard(text);
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Ionicons name="copy" size={15} color="white" />
                    <Text style={{ color: 'white' }}>Copy</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={atomDark}
                highlighter="prism"
                customStyle={{
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                {code}
              </SyntaxHighlighter>
            </>
          );
        },
      }}
    >
      {content}

    </Markdown>
  );
};

const styles = StyleSheet.create({
  messageText: {
    color: '#f9f9f9',
  },
  messageUser: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  internalAiMessage: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '85%',
  },
  internalUserMessage: {
    padding: 10,
    backgroundColor: '#191919',
    borderRadius: 15,
    maxWidth: '90%',
  },
  bottomOptions: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    marginLeft: '12%',
  },
});
