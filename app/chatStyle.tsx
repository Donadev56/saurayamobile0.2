import {StyleSheet , Platform} from 'react-native'

export const ChatStyle = StyleSheet.create ({

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
  
      marginTop : Platform.OS === "web" ? 50 : -40 ,
      display : "flex",
      width: "100%",
      flexDirection : "column",
      alignItems : "center",
      justifyContent : 'center'
      
  
    },
    inputContainer : {
      position : "absolute",
      bottom :"-10%",
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
    },
    options : {
      minHeight : "83%" ,
      width : '90%',
      display : 'flex',
      justifyContent : 'center',
      alignItems : 'center'
    
    },
    topOptions : {
      display : 'flex',
      gap : 20,
      flexDirection : 'row',
      marginBottom : 15
  
    },
    bottomOptions : {
      display : 'flex',
      gap : 20,
      flexDirection : 'row'
    },
    optionsText : {
      color : '#737373',
      fontWeight : 'bold'
    },
    optionsElement : {
      gap : 5,
      display : 'flex',
      flexDirection : 'row',
      alignItems : 'center',
      borderColor : '#737373',
      borderWidth : 0.5,
      padding: 8,
      borderRadius : 20
    }
  })  