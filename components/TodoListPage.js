import React from "react";
import * as firebase from "firebase";

import { StyleSheet, Text, View,Button } from "react-native";

function TodoListPage() {
  return (
    <View>
      <Text>TodoListPage</Text>
      <View>
              <Button title="Sign out" onPress={() => {
                  firebase.auth().signOut()
              }}/>
      </View>
    </View>
  );
}

export default TodoListPage;
