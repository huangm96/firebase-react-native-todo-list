import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import * as firebase from "firebase"
import { firebaseConfig } from './FirebaseConfig';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoListPage from './components/TodoListPage';


firebase.initializeApp(firebaseConfig)

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sign Up"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Todo List"
        component={TodoListPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
