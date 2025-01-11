import {
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { Platform, Animated } from 'react-native';
import TopBarDashboard from '@/components/chat/topBar';
import {
  MessageInterface,
  OllamaChatRequest,
  PartialResponse,
} from './types/interface';
import { MessageContainer } from '@/components/chat/messageContainer';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { UIManager } from 'react-native';
import { ChatStyle } from './chatStyle';
import { io, Socket } from 'socket.io-client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Enums } from './enums';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { RemoveMarkdown } from './utils/scripts';
import { SideBar } from '@/components/chat/sideBar';
import { ConversationsInterface } from './types/interface';
import {
  GetDataFromLocalStorage,
  SaveDataToLocalStorage,
} from './utils/dataSaver';
import { GetDate } from './utils/date';
import { getUniqueID } from 'react-native-markdown-display';
import { systemMessage } from './utils/system';

const ChatSpace = () => {
  const [text, setText] = useState('');
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const socket = useRef<Socket | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const flatListRef = useRef<FlatList | null>(null);
  const [soundInstance, setSoundInstance] = useState<Audio.Sound | null>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [conversations, setConversations] = useState<ConversationsInterface>(
    {}
  );
  const [userId, setUserId] = useState('');

  const [isDone, setIsDone] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const conversationName = `conversations/${userId}`;

  const reinitConversations = () => {
    setMessages([]);
    setConversationId('');
    setText('');
    setIsDone(false);
    setIsOpen(false);
    setIsLoading(false);
    setIsPlaying(false);
    soundInstance?.stopAsync();
    setSoundInstance(null);
    setIsGeneratingText(false);
    socket.current?.emit(Enums.stopGeneration);

    getConversationAll();
    console.log('Conversations reinitialized successfully');
  };

  const getConversationByIDAndDate = async (
    conversationId: string,
    date: string
  ) => {
    try {
      const conversation = await GetDataFromLocalStorage(conversationName);
      if (conversation) {
        const parsedConversation = JSON.parse(conversation);
        if (
          parsedConversation[date] &&
          parsedConversation[date][conversationId]
        ) {
          setMessages(parsedConversation[date][conversationId].messages);
          setConversationId(conversationId);
          getConversationAll();
        }
      } else {
        console.log('No conversation found');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const deleteConversation = (conId: string, day: string) => {
    setConversations((prevConversations) => {
      const updatedConversations = { ...prevConversations };

      if (updatedConversations[day] && updatedConversations[day][conId]) {
        const { [conId]: _, ...remainingConversations } =
          updatedConversations[day];

        if (Object.keys(remainingConversations).length === 0) {
          delete updatedConversations[day];
        } else {
          updatedConversations[day] = remainingConversations;
        }
      } else {
        console.error('The conversation does not exist', 'error');
      }

      SaveDataToLocalStorage(
        JSON.stringify(updatedConversations),
        conversationName
      );

      return updatedConversations;
    });
  };
  const speak = async (text: string) => {
    setIsLoading(true);

    try {
      soundInstance?.stopAsync();

      const result = await fetch('https://converter.sauraya.com/convert/', {
        method: 'POST',
        body: JSON.stringify({ text: text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.status === 200) {
        const arrayBuffer = await result.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        const fileUri = `${FileSystem.cacheDirectory}audio.mp3`;

        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
        await sound.playAsync();
        setIsPlaying(true);
        setSoundInstance(sound);

        sound.setOnPlaybackStatusUpdate(async (status: any) => {
          if (status.didJustFinish) {
            console.log('Audio ended');
            sound.unloadAsync();

            await FileSystem.deleteAsync(fileUri);

            setIsPlaying(false);
          }
        });
        setIsLoading(false);
      } else {
        console.error('Error :', result.status);
      }
    } catch (error) {
      console.error('Error :', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    getConversationAll();
  }, []);

  const getConversationAll = async () => {
    /* if (!userId) {
      console.warn("User ID not found");
      return;
    }*/

    const lastConversation = await GetDataFromLocalStorage(conversationName);
    if (lastConversation) {
      setConversations(JSON.parse(lastConversation));
    } else {
      console.warn('No conversation found in local storage');
    }
    try {
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const SaveConversations = async (newMessages: MessageInterface[]) => {
    try {
      const title = newMessages[0]?.content;
      const currentDate = GetDate();
      const newID = getUniqueID();
      let id: string = '';
      const conversations = await GetDataFromLocalStorage(conversationName);
      const conversationsList = conversations ? JSON.parse(conversations) : {};
      if (!conversationsList[currentDate]) {
        conversationsList[currentDate] = {};
      }

      if (!conversationsList[currentDate][conversationId]) {
        conversationsList[currentDate][newID] = { title: title, messages: [] };
        id = newID;
        console.log('New conversation ID : ', newID);
        setConversationId(newID);
      } else {
        console.log('Existing conversation ID : ', conversationId);
        id = conversationId;
      }
      if (newMessages.length === 0) {
        console.error('No new messages to update');
        return;
      }
      conversationsList[currentDate][id].messages = newMessages;
      const response = await SaveDataToLocalStorage(
        JSON.stringify(conversationsList),
        conversationName
      );
      setConversations(conversationsList);
      if (!response) {
        console.error('Conversations was not saved.');
        return;
      }
      setConversations(conversationsList);

      console.log('Conversations updated successfully');
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  useEffect(() => {
    socket.current = io('http://185.97.144.209:7000');
    const sk = socket.current;
    if (sk) {
      sk?.on('connect', () => {
        console.log('connected ');
      });
      sk?.on('error', (error) => {
        console.log('An error occured', error);
        alert(error);
      });

      sk?.on('PartialResponse', (response: PartialResponse) => {
        const responseMessage = response.response.message;
        scollToBottom();

        if (response.isFirst) {
          setIsDone(false);
          const newMessage: MessageInterface = {
            content: responseMessage.content,
            role: responseMessage.role as 'assistant',
          };
          setMessages((lastMessages) => {
            return [...lastMessages, newMessage];
          });

          return;
        }
        setMessages((lastMessages) => {
          const lastIndex = lastMessages.length - 1;
          const lastMessage = lastMessages[lastIndex];
          const newMessage =
            lastMessage.content + response.response.message.content;

          lastMessages[lastIndex].content = newMessage;
          if (response.response.done) {
            setIsGeneratingText(false);
            const textWithEmojies = RemoveMarkdown(newMessage);
            const emojiRegex =
              /(?:\p{Emoji}(?:\p{Emoji_Modifier}|\uFE0F)?(?:\u200D\p{Emoji})*)/gu;
            const text = textWithEmojies?.replace(emojiRegex, '');

            speak(text);
            setIsDone(true);
          }
          return [...lastMessages];
        });
      });
      sk?.on('Error', (error: any) => {
        console.log('An error occured :', error);
      });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, () => {
      setIsInputFocus(true);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => {
      setIsInputFocus(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    try {
      soundInstance?.stopAsync();

      setIsGeneratingText(true);
      Keyboard.dismiss();
      const newMessage: MessageInterface = {
        role: 'user',
        content: text,
      };
      let newMessages: MessageInterface[] = [];
      if (messages.length === 0) {
        newMessages = [systemMessage, newMessage];
      } else {
        newMessages = [...messages, newMessage];
      }
      const request: OllamaChatRequest = {
        messages: newMessages,
        stream: true,
        model: 'llama3.2:1b',
      };

      socket?.current?.emit(Enums.chat, request);
      console.log('Message sent');
      setMessages((lastMessages) => [...lastMessages, newMessage]);
      setText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionsClick = (opt: string) => {
    if (opt === 'code') {
      setText(
        'Generate Python code to show me your programming skills, choose the type of code.'
      );
    } else if (opt === 'summary') {
      setText('Make a summary of');
    }
  };

  const scollToBottom = () => {
    try {
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (e) {
      console.error(e);
    }
  };
  const stopGenerating = async () => {
    try {
      if (socket.current) {
        socket.current.emit(Enums.stopGeneration);
        console.log('Generation stoped.');
        setIsGeneratingText(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isDone) {
      SaveConversations([...messages]);
    }
  }, [isDone]);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />
        <KeyboardAvoidingView
          style={ChatStyle.chatScreen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <SideBar
            reinitConversations={reinitConversations}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            conversationId={conversationId}
            conversations={conversations}
            deleteConversation={deleteConversation}
            getConversationByIDAndDate={getConversationByIDAndDate}
          />
          {isOpen && (
            <Pressable
              android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#0d0d0d99', // Un fond sombre et transparent
                  zIndex: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => setIsOpen(false)}
            >
              <View />
            </Pressable>
          )}
          <View style={ChatStyle.chatScreen}>
            <TopBarDashboard
              reinitConversations={reinitConversations}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <View style={ChatStyle.chatSpace}>
              {messages.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  showsVerticalScrollIndicator={false}
                  style={{
                    minHeight: '83%',
                    width: '90%',
                    maxHeight: isInputFocus ? '80%' : '83%',
                  }}
                  data={messages}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <MessageContainer
                      speak={speak}
                      setSoundInstance={setSoundInstance}
                      soundInstance={soundInstance!}
                      isLoading={isLoading}
                      setIsPlaying={setIsPlaying}
                      isPlaying={isPlaying}
                      setIsLoading={setIsLoading}
                      index={index}
                      msgSize={messages.length}
                      isInputFocus={isInputFocus}
                      msg={item}
                    />
                  )}
                />
              ) : (
                <View style={ChatStyle.options}>
                  <View style={ChatStyle.topOptions}>
                    <TouchableOpacity
                      onPress={() => {
                        handleOptionsClick('code');
                      }}
                    >
                      <View style={ChatStyle.optionsElement}>
                        <Entypo name="code" size={24} color="#00ec7a" />
                        <Text style={ChatStyle.optionsText}> Code</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleOptionsClick('summary');
                      }}
                    >
                      <View style={ChatStyle.optionsElement}>
                        <Feather name="edit-2" size={24} color="yellow" />
                        <Text style={ChatStyle.optionsText}>
                          {' '}
                          Summarize a text
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={ChatStyle.bottomOptions}>
                    <TouchableOpacity>
                      <View style={ChatStyle.optionsElement}>
                        <AntDesign name="user" size={24} color="orange" />
                        <Text style={ChatStyle.optionsText}> Get advice </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={ChatStyle.optionsElement}>
                        <FontAwesome5
                          name="hands-helping"
                          size={24}
                          color="#8b00ff"
                        />
                        <Text style={ChatStyle.optionsText}>
                          {' '}
                          Help me write{' '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={ChatStyle.inputContainer}>
                <View style={ChatStyle.topInput}>
                  <TextInput
                    multiline={true}
                    textAlignVertical="top"
                    scrollEnabled={true}
                    placeholderTextColor={'grey'}
                    cursorColor={'grey'}
                    placeholder="Message Sauraya"
                    style={ChatStyle.input}
                    value={text}
                    onChangeText={setText}
                  />

                  {isGeneratingText ? (
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        style={{
                          fontSize: 20,
                          padding: 10,
                          backgroundColor: 'white',
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => stopGenerating()}
                        name="square-rounded"
                        size={24}
                        color="#212121"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (text.length === 0) {
                          return;
                        }
                        sendMessage();
                      }}
                    >
                      <AntDesign
                        style={{
                          opacity: text.length > 0 ? 1 : 0.5,
                          fontSize: 20,
                          padding: 10,
                          backgroundColor: 'white',
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        name="arrowup"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default function Index() {
  return <ChatSpace />;
}
