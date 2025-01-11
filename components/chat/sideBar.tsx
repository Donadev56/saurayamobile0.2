import React, { useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { ConversationsInterface } from '@/app/types/interface';

type ConversationsProps = {
  conversations: ConversationsInterface;
  conversationId: string;
  getConversationByIDAndDate: (id: string, day: string) => void;
  deleteConversation: (id: string, day: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reinitConversations :()=> void
};

export const SideBar: React.FC<ConversationsProps> = ({
  isOpen,
  setIsOpen,
  conversations,
  conversationId,
  getConversationByIDAndDate,
  reinitConversations,
  deleteConversation,
}) => {
  const translateX = React.useRef(new Animated.Value(-350)).current; 

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -350, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const FormatedDate = (date: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastDayNumber = Number(date.split('-')[2]);
    const todayNumber = Number(currentDate.split('-')[2]);

    if (currentDate === date) {
      return 'Today';
    } else if (todayNumber === lastDayNumber + 1) {
      return 'Yesterday';
    } else {
      return date.replace('-', ' ');
    }
  };

  return (
    <Animated.View
      style={[
        styles.sideBar,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <View style={styles.sideBarContainer}>
        <View style={styles.sideBarTop}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Search..."
              placeholderTextColor="grey"
              cursorColor={'grey'}
            />
            <TouchableOpacity onPress={reinitConversations} style={styles.iconButton}>
              <Feather name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.middle}>
          {conversations && (
            <FlatList
             showsVerticalScrollIndicator={false}
              data={Object.entries(conversations).reverse()}
              keyExtractor={([day]) => day}
              renderItem={({ item: [day, chats] }) => (
                <View style={styles.lastConversationList}>
                  <Text style={styles.lastConDate}>{FormatedDate(day)}</Text>
                  <FlatList
                    data={Object.entries(chats).reverse()}
                    keyExtractor={([id]) => id}
                    renderItem={({ item: [id, data] }) => (
                      <Pressable
                      android_ripple={{ color: 'rgba(255,255,255,0.3)' }}

                        onPress={() => getConversationByIDAndDate(id, day)}
                        
                      >
                        <View style={{
    maxWidth : '100%',
    overflowX : 'scroll',
    backgroundColor: id === conversationId ? 'white'  : '',

    marginBottom: 10,
    padding: 17,
  }}>
                          <View style={styles.lastConv}>
                            <Text style={ {
    maxWidth : '90%',
    overflow : 'hidden',
    textOverflow: 'ellipsis', 
    color: id === conversationId ? 'black' : '#cfcfcf',
    fontWeight : 'bold',
    fontSize: 14,
  }}>{data.title.slice(0, 19)} {data.title.length > 19 && '...'}</Text>
                            <TouchableOpacity
                              onPress={() => deleteConversation(id, day)}
                            >
                              <Feather style={{
                                opacity : 0.4
                              }} name="trash" size={19} color="white" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Pressable>
                    )}
                  />
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sideBar: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10000,
    borderRightColor: '#212121',
    borderRightWidth: 0.5,
    maxWidth: 250,
  },
  sideBarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems :'center'
  },
  sideBarTop: {
    padding : 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#212121',
   
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212121',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 10,
    width : '100%'
  },
  textInput: {
    color: 'white',
    fontSize: 16,
    width: '70%',
    paddingVertical: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
  middle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection : 'column',
    minHeight : '90%',
    maxHeight : '90%'
  },
  lastConversationList: {
    width: '100%',
    justifyContent :'center',
    flexDirection : 'column',
    display : 'flex'
  },
  lastConDate: {
    padding : 17,
    fontWeight : 'bold',

    color: 'white',
    fontSize: 21,
    marginVertical: 10,
  },
  lastConvContainer: {
    backgroundColor: '#212121',

    marginBottom: 10,
    borderRadius: 29,
    padding: 10,
  },
  lastConv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conName: {
    maxWidth : '90%',
    overflow : 'hidden',
    textOverflow: 'ellipsis', 
    color: 'white',
    fontSize: 14,
  },
});
