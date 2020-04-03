import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { SwipeableFlatList } from "react-native-swipeable-flat-list";

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  
  
} from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Form,
  Input,
  Item,
  Label,
  Button,
  Icon,
  List,
  ListItem,
  Title
} from "native-base";

function TodoListPage() {
    

    const [newName, setNewName] = useState('')
    const [dataList, setDataList] = useState([])
    useEffect(() => {
        firebase.database().ref("/contacts").on('child_added', (data) => {
            dataList.push(data)
        })
    },[])
    const addRow = () => {
        if (newName) {
            var key = firebase.database().ref('/contacts').push().key
            firebase.database().ref('/contacts').child(key).set({name:newName})
        }
    }
    const deleteRow = () => { };
    const showInfo = () => {};
  return (
    <Container style={styles.container}>
      <Header style={{ marginTop: StatusBar.currentHeight }}>
        <Body>
          <Title>List</Title>
        </Body>
      </Header>
      <Content>
        <Item>
          <Input
            placeholder="Add name"
            onChangeText={text => setNewName(text)}
          />
          <Button onPress={addRow}>
            <Icon name="add" />
          </Button>
        </Item>
    
        <SwipeableFlatList
          keyExtractor={(item, index) => {
            return "item-" + index;
                  }}
                  enableEmptySections
          data={dataList}
          renderItem={({ item }) => (
            <Text style={{ height: 48 }}>{item.name}</Text>
          )}
          renderLeft={({ item }) => (
            <Button full style={{ width: 75 }} onPress={showInfo}>
              <Icon name="information-circle" />
            </Button>
          )}
          renderRight={({ item }) => (
            <Button full danger style={{ width: 75 }} onPress={deleteRow}>
              <Icon name="trash" />
            </Button>
          )}
          backgroundColor={"white"}
        />
        {/* <FlatList
          keyExtractor={(item, index) => {
            return "item-" + index;
          }}
          data={data}
          renderItem={({ item }) => (
            <SwipeRow
              leftOpenValue={75}
              rightOpenValue={-75}
              left={
                <Button full>
                  <Icon name="information-circle" />
                </Button>
              }
              body={
                <View>
                  <Text style={{ paddingLeft: 15 }}>{item}</Text>
                </View>
              }
              right={
                <Button full danger>
                  <Icon name="trash" />
                </Button>
              }
            />
          )}
         
        /> */}
      </Content>
      {/* <Button
          title="Sign out"
          onPress={() => {
            firebase.auth().signOut();
          }}
        >
          <Text>Sign out</Text>
        </Button>
         */}
    </Container>
  );
}

export default TodoListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});
