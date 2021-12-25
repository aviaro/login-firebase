//@refresh reset
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
//import firebase from 'firebase/app'
import * as firebase from "firebase/app";
//import * as firebase from 'firebase'
import 'firebase/firestore';



 const firebaseConfig = {
   apiKey: "AIzaSyBmERSQnQPDDBscITuUGAgASzx4fKVcZIM",
   authDomain: "chatapp-53447.firebaseapp.com",
   projectId: "chatapp-53447",
   storageBucket: "chatapp-53447.appspot.com",
  messagingSenderId: "358803574524",
   appId: "1:358803574524:web:2633227b0f0d12cbaf5179"
 };

if (firebase.apps.length == 0){
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const chatRef = db.collection('chats');

export default function App() {

  const [messages,setMessages] = useState([]);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [firstName,setFirstName] = useState('')
  const [lastName,setlastName] = useState('')
 

  useEffect(() => {
    const unsubscribe = chatRef.onSnapshot((querySnepshot) => {
      const messageFirestore = querySnepshot
      .docChanges
      .filter(({ type }) => type === 'added')
      .map(({ doc }) => {
        const message = doc.data();
        return { ...message, createdAt: message.createdAt.toDate }
      })
      ///.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
      appendMessage(messageFirestore);
    })
    return () => unsubscribe();
  },[]);

  const appendMessage = useCallback((messageFirestore) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messageFirestore))
  }, [messages]);

  const sendMessage = async (messages) => {
    const newMessage = messages.map((m) => chatRef.add(m));
    await Promise.all(newMessage); 
  };

  const users = [
    {
      email:'LironBinyamin@gmail.com',
      password:'121212',
      fname:'Liron',
      lname:'Binyamin',
      position:'Fronted DEveloper'
    },
    {
      email:'AviArbov@gmail.com',
      password:'151515',
      fname:'Avi',
      lname:'Arbov',
      position:'IT SECURITY'
    },
    {
      email:'DorAzulay@gmail.com',
      password:'171717',
      fname:'Dor',
      lname:'Azulay',
      position:'IT SECURITY'
    },
  ];

  const loadDataFromAsyncStorage = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('myAccount');
      if (data !== null) {
        const formatted = JSON.parse(data);
        setFirstName(formatted.fname)
        setlastName(formatted.lname)
      }else{
        console.log('There is no data exist');
      }
    } catch (error) {
      console.log(error.message);
    }
  },[setFirstName]);

  useEffect(() => {
    loadDataFromAsyncStorage();
  },[loadDataFromAsyncStorage()])

  const removeDataFromAsyncStorage = async () => {
     AsyncStorage.removeItem('myAccount');
     console.log('User LogedOut');
  };

  const login = () => {
    const account = users.find(x => x.email === email);
    if (account) {
      console.log('User exist!!');
      if (password == account.password) {
        
        AsyncStorage.setItem('myAccount',JSON.stringify({
          fname: account.fname,
          lname: account.lname,
          email: account.email,
          position: account.position
        }));


      }else{
        console.log('Password not match');
      }
    }else{
      console.log('User not found');
    }
  }

  return (
    <View style={styles.container}>
      {
        firstName !== ''?
        (
          <View style={{height:'100%', width:'80%', alignItems:'center'}}>
            <View style={{height:'90%' ,width:'100%',height:'50%'}}>
              
            <GiftedChat 
              messages={messages}
              user={{firstName}}
              onSend={sendMessage}
            
            />
            </View>
            <View style={{height:'10%', margin:40}}>
              <TouchableOpacity  onPress={removeDataFromAsyncStorage} style={{width:100, borderColor:'#000', backgroundColor:'#ff0899', borderRadius:10, padding:10, alignItems:'center'}}>
                <Text>{console.log(firstName)}</Text>
                <Text>LOG OUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
        :
        (
          <View style={{width:'80%', alignItems:'center'}}>
            <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            placeholder='Email:'
            keyboardType='email-address'
            autoCapitalize='none'
            />
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              placeholder='Password:'
              keyboardType='default'
              autoCapitalize='none'
              secureTextEntry={true}
            />
      
            <TouchableOpacity onPress={login} style={{width:100, borderColor:'#000', backgroundColor:'#0066ff', borderRadius:10, padding:10, alignItems:'center',margin:20}}>
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        )
      }
       
      
        
      
    </View>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    width:'70%',
    paddingVertical:10,
    padding:10,
    borderColor:'#000',
    backgroundColor:'#ffff',
    borderWidth:3,
    borderRadius:10,
    margin:10
  }
});