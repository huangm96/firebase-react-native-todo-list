import React from "react";

import { StyleSheet, Text, View } from "react-native";
import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label
} from "native-base";
function Login() {
  return (
    <Container style={styles.container}>
      <Form>
        <Item floatingLabel>
          <Label>Email</Label>
          <Input autoCorrect={false} autoCapitalize="none" />
        </Item>
        <Item floatingLabel>
          <Label>Password</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
          />
              </Item>
              <Button style={{marginTop:20}} full rounded success ><Text>Login</Text></Button>
      </Form>
    </Container>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
        justifyContent: "center",
    padding:20
  }
});
