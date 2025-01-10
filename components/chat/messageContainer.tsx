import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Markdown from "react-native-markdown-display";
import Feather from '@expo/vector-icons/Feather';
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/styles/prism";
import { Buffer } from 'buffer';

import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { MessageInterface } from "@/app/types/interface";
import { markdownStyles } from "./markdownStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from "react-native";
import { CopyToClipboard, RemoveMarkdown } from "@/app/scripts/scripts";
type MessageProps = {
  msg: MessageInterface;
  isInputFocus : boolean;
  msgSize : number;
  index : number
};

export const MessageContainer = ({ index ,  msg , msgSize , isInputFocus }: MessageProps) => {
   const [soundInstance , setSoundInstance] = useState<Audio.Sound | null>()
   const [isPlaying , setIsPlaying] = useState(false)
   const [isLoading, setIsLoading] = useState(false)
  const stopPlaying = ()=> {
    soundInstance?.stopAsync()
    setIsPlaying(false)
  }
  const speak = async (text: string) => {
    setIsLoading(true)
    
    try {
      if (soundInstance) {
        soundInstance.stopAsync()
      } else {
        console.log('No old instance found')
      }
      const result = await fetch("https://converter.sauraya.com/convert/", {
        method: "POST",
        body: JSON.stringify({ text: text }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (result.status === 200) {
        const arrayBuffer = await result.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
  
        const fileUri = `${FileSystem.cacheDirectory}audio.mp3`;
  
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
       
        const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
        await sound.playAsync();
        setIsPlaying(true)
        setSoundInstance(sound)

        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            console.log("Audio ended");
            setIsPlaying(false)
            sound.unloadAsync();
          }
        });
        setIsLoading(false)
      } else {
        console.error("Error :", result.status);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };
  
  if (msg.role === "assistant") {
    return (
      <View style={{
        padding: 12,
        marginBottom: msgSize === index + 1 &&  isInputFocus ? 20 : 5,
      }}>
        <View style={styles.internalAiMessage}>
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../../assets/logos/transparent/8.png")}
          />
          <MarkdownContent content={msg.content} />
       
        </View>
      {msgSize === index + 1 &&  <View style={styles.bottomOptions} >
         
    {
    
    isLoading ? 
     <ActivityIndicator  color={'orange'} /> 
    
    :  isPlaying ?
     <MaterialCommunityIcons onPress={()=> stopPlaying()} name="square-rounded" size={24} color="#cbcbcb" />
    
    :  <TouchableOpacity onPress={ async()=> {
          const text =  RemoveMarkdown(msg.content)
            speak(text)
          }} >
            
   <Feather name="volume-2" size={24} color="#cbcbcb" />
   </TouchableOpacity> 
   }
           <TouchableOpacity  onPress={async ()=> {
            const text =  RemoveMarkdown(msg.content)
            if (text) {
              await CopyToClipboard(text)
            }
           }} >
          
          <Ionicons name="copy" size={20} color="#cbcbcb" />
          </TouchableOpacity>
          <TouchableOpacity>

          <Feather name="refresh-ccw" size={20} color="#cbcbcb" />
          </TouchableOpacity>

          </View>}
      </View>
    );
  } else if (msg.role === "user") {
    return (
      <View style={styles.messageUser}>
        <View style={styles.internalUserMessage}>
          <Text style={styles.messageText}>{msg.content}</Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

const MarkdownContent = ({ content }: { content: string }) => {
  return (
    <Markdown
      style={(markdownStyles as any)}
      rules={{
        fence: (node) => {
      
          const language =( node as any )?.sourceInfo || 'javascript';
          const code = node.content;

          return (
            <>
            <View style={{
              padding : 6 ,
              backgroundColor : "#212121" ,
              display: 'flex',
              justifyContent : 'space-between',
              alignContent : 'center',
              flexDirection : 'row',
              borderRadius :10,
              width : "100%", 

            }} >
              <View >
             <Text style={{ color: 'white' }}>{language}</Text>
              </View> 
              <TouchableOpacity onPress={ async ()=> {
                const text = RemoveMarkdown(code)
                await CopyToClipboard(text)
              }} >
              <View style={{
                display : 'flex',
                justifyContent : 'space-between',
                gap :5,
                flexDirection : 'row',
                alignItems : 'center'
                
              }}><Ionicons name="copy" size={15} color="white" />
             <Text style={{
                color : 'white'
              }}>Copy</Text></View>
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
    color: "#f9f9f9",
  },
  messageUser: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  messageAssistant: {
    padding: 12,
    marginBottom: 5,
  },
  internalAiMessage: {
    flexDirection: "row",
   
    gap: 10,
    maxWidth: "85%",
  },
  internalUserMessage: {
    padding: 10,
    backgroundColor: "#191919",
    borderRadius: 15,
    maxWidth: "90%",
  },
  bottomOptions : {
      display : 'flex',
      flexDirection : 'row',
      padding : 10,
      gap : 10,
      marginLeft : '12%'
  }
});
