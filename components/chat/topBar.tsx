import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

export default function TopBarDashboard() {

  return (
     <View style={style.topBar} >
      <View style={style.topBarContainer}>
      <View style={style.left} >
        <TouchableOpacity >
       
        <FontAwesome6  style={style.iconColor}  name="bars-staggered" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity >

        <Text style={{
          color : "#ededed",
          fontWeight : "bold",
          fontSize : 18
        }} >Sauraya AI</Text>
            </TouchableOpacity>


      </View>
      <View style={style.right}>
        <TouchableOpacity >
        <Feather style={style.iconColor}  name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity >
        <Entypo  style={style.iconColor} name="dots-three-vertical" size={24} color="black" />
        </TouchableOpacity>
        </View>
        </View>
     </View>
    
  );
}

const style = StyleSheet.create ({
  topBarContainer : {
    padding : 15,
    display : "flex",
    flexDirection: "row",
    justifyContent : "space-between",
    backgroundColor: "#0d0d0d" ,


  } ,
  chatScreen : {
    backgroundColor: "#0d0d0d" ,
    height: "100%" ,
    display : 'flex',
    width : "100%",
    flexDirection : "column",
    alignItems : "center"

  } 
  ,

  topBar : {
    position : "fixed",
    top : 0,
    width : "100%",
    zIndex : 2000

  },
  left : {
    display : "flex",
    gap : 10,
    flexDirection : "row",
    justifyContent : "center",
    alignItems : "center",
    


  },
  right : {
    display : "flex",
    gap : 10,
    flexDirection : "row",
    justifyContent : "center",
    alignItems : "center"

  },
  iconColor : {
    color : "#ededed"
  }

})