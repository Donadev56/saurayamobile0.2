import {   FlatList, KeyboardAvoidingView, Keyboard ,Pressable, ScrollView, StatusBar, Text, TextInput, TouchableHighlight, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { Platform } from "react-native";
import TopBarDashboard from "@/components/chat/topBar";
import { MessageInterface, OllamaChatRequest, PartialResponse } from "./types/interface";
import { MessageContainer } from "@/components/chat/messageContainer";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { LayoutAnimation, UIManager } from 'react-native';
import { ChatStyle } from "./chatStyle";
import { io, Socket } from "socket.io-client";


const ChatSpace = ()=>  {
  const [text, setText] = useState("");
  const [isInputFocus , setIsInputFocus] = useState(false)
  const [messages , setMessages] = useState<MessageInterface[]  >([])
  const socket = useRef<Socket | null>(null);
  const flatListRef = useRef< FlatList| null>(null);

  useEffect(()=> {
  },[])
  useEffect(()=> {
    socket.current = io("http://185.97.144.209:7000");
    const sk = socket.current
    if (sk) { 

    sk?.on('connect', ()=> {
      console.log('connected ')
    })
    sk?.on('error', (error)=> {
      console.log('An error occured', error)
      alert(error)
    })

    sk?.on('PartialResponse', (response : PartialResponse)=> {
      const responseMessage = response.response.message

      if (response.isFirst) {
        const newMessage : MessageInterface = {
          content : responseMessage.content,
          role : responseMessage.role as 'assistant'
        }
        setMessages((lastMessages)=>  { return [...lastMessages , newMessage]})
        scollToBottom()

        return
      }
      setMessages((lastMessages)=> {
        const lastIndex = lastMessages.length - 1
        const lastMessage = lastMessages[lastIndex]
        const newMessage = lastMessage.content + response.response.message.content

        lastMessages[lastIndex].content = newMessage
        return [...lastMessages]

      })
    })
    sk?.on('Error', (error : any)=> {
      console.log("An error occured :", error)
    })

  }
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

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
    const newMessage: MessageInterface = {
      role: 'user',
      content: text,
    };
   
    const newMessages = [...messages , newMessage]
    const request : OllamaChatRequest =  {
      messages : newMessages,
      stream : true , 
      model : 'llama3.2:1b'
    }

    socket?.current?.emit('Chat', request)
    console.log("Message sent")
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((lastMessages) => [...lastMessages, newMessage]);
    setText('');
  } catch (error) {
    console.error(error);
  }
};

const handleOptionsClick = (opt : string)=> {
  if (opt === 'code') {
    setText("Generate Python code to show me your programming skills, choose the type of code.")
  }

}

const scollToBottom = ()=> {
      ( flatListRef ).current?.scrollToEnd({ animated: true });

}

  return (
    <SafeAreaView >
    <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />

    <KeyboardAvoidingView
    style={ChatStyle.chatScreen}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0}
  >
    <View style={ChatStyle.chatScreen} >

       <TopBarDashboard />
       <View style={ChatStyle.chatSpace} >
    {messages.length > 0 ? 
    
    <FlatList
      ref={flatListRef}
       showsVerticalScrollIndicator={false}
       style ={
        {
          minHeight : "83%" ,
          width : '90%',
          maxHeight :isInputFocus ? '80%' : '83%'
        }
       }
       data={messages}
        keyExtractor={(_ , index)=> index.toString()} 
       renderItem={({ item }) => (
      <MessageContainer  msg={item} />
  )}
/> : <View style={ChatStyle.options}>
      <View style={ChatStyle.topOptions}>
        <TouchableOpacity onPress={()=> {
          handleOptionsClick('code')
        }} >
      <View  style={ChatStyle.optionsElement }>
      <Entypo name="code" size={24} color="#00ec7a" />
      <Text style={ChatStyle.optionsText} > Code</Text>
     </View>  
     </TouchableOpacity>
     <TouchableOpacity >

      <View style={ChatStyle.optionsElement }>
      <Feather name="edit-2" size={24} color="yellow" />
      <Text style={ChatStyle.optionsText} >  Summarize a text</Text>

     
     </View>
     </TouchableOpacity>

       </View>
       <View style={ChatStyle.bottomOptions}>
       <TouchableOpacity >

      <View style={ChatStyle.optionsElement }>
      <AntDesign name="user" size={24} color="orange" />
      <Text style={ChatStyle.optionsText} > Get advice </Text>

     </View>  
     </TouchableOpacity>
     <TouchableOpacity >

      <View style={ChatStyle.optionsElement}>
      <FontAwesome5 name="hands-helping" size={24} color="#8b00ff" />
      <Text style={ChatStyle.optionsText} > Help me write </Text>

     
     </View>
     </TouchableOpacity>

       </View>
    
 
    </View>   }
  <View style={ChatStyle.inputContainer}>
    <View style={ChatStyle.topInput} >

    <TextInput
 multiline={true} 
 textAlignVertical="top" 
 scrollEnabled={true} 
  placeholderTextColor={"grey"}
  cursorColor={"grey"}
  placeholder="Message Sauraya"
  style={ChatStyle.input}
  value={text}
  onChangeText={setText}
/>

  <TouchableOpacity  onPress={()=> {
   if (text.length === 0) {return}
   sendMessage()
  }}>
  <AntDesign 
    style={{
      opacity : text.length > 0? 1  :0.5 ,
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

    </View>

  </View>

       </View>
    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


export default function Index () {
  return (
      <ChatSpace />
  )
}