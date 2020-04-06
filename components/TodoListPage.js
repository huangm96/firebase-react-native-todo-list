import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { SwipeableFlatList } from "react-native-swipeable-flat-list";

import { StyleSheet, Text, View, StatusBar } from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Input,
  Item,
  Button,
  Icon,
  Title,
  Toast
} from "native-base";
import Dialog, { DialogContent } from "react-native-popup-dialog";
const showToast = (type, message) => {
  Toast.show({
    text: `${message}`,
    type: type,
    position: "top",
    duration: 3000
  });
};
function TodoListPage() {
  const [visible, setVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [dataList, setDataList] = useState([]);
  const [updatedName, setUpdatedName] = useState({});

  useEffect(() => {
    firebase
      .database()
      .ref("/contacts")
      .on("value", data => {
        var storage = [];
        for (var i = 0; i < Object.keys(data.val()).length; i++) {
          storage.push({
            key: Object.keys(data.val())[i],
            data: Object.values(data.val())[i]
          });
        }

        setDataList(storage);
      });
  }, []);
  console.log(dataList);
  const addRow = () => {
    if (newName) {
      var key = firebase
        .database()
        .ref("/contacts")
        .push().key;
      firebase
        .database()
        .ref("/contacts")
        .child(key)
        .set({ name: newName })
        .then(res => {
          setNewName("");
          showToast("success", "Added");
        });
    }
  };
  const deleteRow = item => {
    // deleteRow
    firebase
      .database()
      .ref("/contacts")
      .child(item.key)
      .remove()
      .then(res => {
        showToast("danger", "Removed");
      });
  };
    const openDialog = item => {
    
    setVisible(true);
        setUpdatedName({ key:item.key, name:item.data.name });
    };
    console.log(updatedName)
    const updateInfo = () => {
      console.log(updatedName.key)
    firebase
      .database()
      .ref("/contacts/"+updatedName.key)
      
      .update({
        name: updatedName.name
      })
      .then(() => {
          showToast("success", "Updateded");
          setVisible(false)
      });
  };
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
            defaultValue={newName}
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
            <Text style={{ height: 48 }}>{item.data.name}</Text>
          )}
          renderLeft={({ item }) => (
            <Button
              full
              style={{ width: 75 }}
              onPress={() => openDialog(item)}
              title="Show Dialog"
            >
              <Icon name="information-circle" />
            </Button>
          )}
          renderRight={({ item }) => (
            <Button
              full
              danger
              style={{ width: 75 }}
              onPress={() => deleteRow(item)}
            >
              <Icon name="trash" />
            </Button>
          )}
          backgroundColor={"white"}
        />
        <View style={{ flex: 1 }}>
          <Dialog
            visible={visible}
            onTouchOutside={() => {
              setVisible(false);
            }}
            style={{ flex: 3 }}
          >
            <DialogContent>
              <Icon name="information-circle" />
              <Input
                defaultValue={updatedName.name}
                              onChangeText={text => setUpdatedName({ ...updatedName,name:text })}
              />
              <Button
                full
                danger
                style={{ width: 75 }}
                onPress={() => updateInfo()}
              >
                <Text>OK</Text>
              </Button>
            </DialogContent>
          </Dialog>
        </View>
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
    backgroundColor: "#fff"
  },
  dialogContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 10
  }
});
