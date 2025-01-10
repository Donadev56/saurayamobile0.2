import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import Markdown from "react-native-markdown-display";

import SyntaxHighlighter from "react-native-syntax-highlighter";

import { atomDark } from "react-syntax-highlighter/styles/prism";

import { MessageInterface } from "@/app/types/interface";
import { markdownStyles } from "./markdownStyle";

type MessageProps = {
  msg: MessageInterface;
};

export const MessageContainer = ({ msg }: MessageProps) => {
  if (msg.role === "assistant") {
    return (
      <View style={styles.messageAssistant}>
        <View style={styles.internalAiMessage}>
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../../assets/logos/transparent/8.png")}
          />
          <MarkdownContent content={msg.content} />
        </View>
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
      style={markdownStyles}
      rules={{
        fence: (node) => {
      
          const language =( node as any )?.sourceInfo;
          console.log('Le language est :', language)
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
              <View  style={
                {
                  
                }
              }>
             <Text style={{ color: 'white' }}>{language}</Text>
              </View> 
              <TouchableOpacity >
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
});
