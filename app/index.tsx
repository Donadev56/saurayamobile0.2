import {   FlatList, KeyboardAvoidingView, Keyboard ,Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Platform } from "react-native";
import TopBarDashboard from "@/components/chat/topBar";
import { MessageInterface } from "./types/interface";
import { MessageContainer } from "@/components/chat/messageContainer";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from "react";

export default function Index() {
  const [text, setText] = useState("");
  const [isInputFocus , setIsInputFocus] = useState(false)

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

  const messages: MessageInterface[] = [
    {
      role: 'user',
      content: 'Hello, I want to know what is crypto.',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Hello, cryptocurrency is a digital currency that uses blockchain technology.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Can you tell me more about how blockchain works?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Sure! Blockchain is a distributed ledger that records transactions across many computers.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Is cryptocurrency secure?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Cryptocurrency uses cryptography to secure transactions, making it highly secure if properly managed.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Can I use cryptocurrency for online purchases?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Yes, many platforms accept cryptocurrency as a payment method.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'What are some examples of cryptocurrencies?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Some examples include Bitcoin, Ethereum, and Litecoin.',
      images: undefined,
    },   {
      role: 'user',
      content: 'Hello, I want to know what is crypto.',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Hello, cryptocurrency is a digital currency that uses blockchain technology.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Can you tell me more about how blockchain works?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Sure! Blockchain is a distributed ledger that records transactions across many computers.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Is cryptocurrency secure?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Cryptocurrency uses cryptography to secure transactions, making it highly secure if properly managed.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'Can I use cryptocurrency for online purchases?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Yes, many platforms accept cryptocurrency as a payment method.',
      images: undefined,
    },
    {
      role: 'user',
      content: 'What are some examples of cryptocurrencies?',
      images: undefined,
    },
    {
      role: 'assistant',
      content: 'Some examples include Bitcoin, Ethereum, and Litecoin.',
      images: undefined,
    },
  ];
  

  return (
    <KeyboardAvoidingView
    style={style.chatScreen}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0}
  >
    <View style={style.chatScreen} >
    <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />

       <TopBarDashboard />
       <View style={style.chatSpace} >
       <FlatList
       showsVerticalScrollIndicator={false}
       style ={
        {
          width : '90%',
          maxHeight :isInputFocus ? '70%' : '82%'
        }
       }
       data={messages}
        keyExtractor={(_ , index)=> index.toString()} 
       renderItem={({ item }) => (
      <TouchableOpacity >
      <MessageContainer  msg={item} />
    </TouchableOpacity>
  )}
/>
  <View style={style.inputContainer}>
    <View style={style.topInput} >

    <TextInput
 multiline={true} 
 textAlignVertical="top" 
 scrollEnabled={true} 
  placeholderTextColor={"grey"}
  cursorColor={"grey"}
  placeholder="Message Sauraya"
  style={style.input}
  value={text}
  onChangeText={setText}
/>

  <TouchableOpacity>
  <AntDesign 
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

  );
}




const style = StyleSheet.create ({

  chatScreen : {
    backgroundColor: "#0d0d0d" ,
    height: "100%" ,
    display : 'flex',
    width : "100%",
    flexDirection : "column",
    alignItems : "center",

  }  ,
  chatSpace  : {
    maxWidth : 1000,

    marginTop : Platform.OS === "web" ? 50 : 20 ,
    display : "flex",
    width: "100%",
    flexDirection : "column",
    alignItems : "center",
    justifyContent : 'center'
    

  },
  inputContainer : {
    position : "fixed",
    bottom :"5%",
    borderRadius : 20,
    display : "flex",
    alignItems : "center",
    width: "91%",
    padding: 10,
    height : 110,
    backgroundColor : "#191919" ,
    maxWidth : 1000,

    zIndex : 1000
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
    padding: 5,
    width : "90%" ,
    maxWidth : "95%" ,
    backgroundColor : "#191919" ,
    color: "white"
  

   
  },
  topInput : {
    display : 'flex',
    width : '100%',
    flexDirection : 'row',
    paddingInline : 8,
    maxWidth : "100%",
  }
})  