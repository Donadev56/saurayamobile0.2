import { MessageInterface } from "@/app/types/interface"
import { StyleSheet  , Text} from "react-native"

import { View } from "react-native"

type messageProps = {
    msg : MessageInterface
}
export const MessageContainer = ({msg} : messageProps)=> {
    if (msg.role === "assistant") {
      return ( 
      <View style={style.messageAssistant}>
      <View style={ style.internalAiMessage }>
      <Text style={style.messageText}>{msg.content}</Text>
     </View>
     </View>)
    } else if (msg.role === 'user') {
      return ( 
        <View style={style.messageUser}>
        <View style={ style.internalUserMessage }>
        <Text style={style.messageText}>{msg.content}</Text>
       </View>
       </View>)
      
    }
    else {
      return 
    }
    
  }

  const style = StyleSheet.create({
    messageText : {
        color : "#f9f9f9" ,
    
      } ,
      messageUser : {
       width : "100%",
       justifyContent : "center",
       display : 'flex',
       alignItems : "flex-end" ,
       marginBottom : 5
    
    
      },
      messageAssistant : {
        padding : 12,
        marginBottom : 5
    
      },
      internalAiMessage : {
    
      },
      internalUserMessage : {
        padding : 10,
        backgroundColor : "#191919",
        borderRadius : 15,
        maxWidth  : "90%"
    
      }
  })