import React,{useState} from "react";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label,Toast,
  Spinner
} from "native-base";
function Login({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const showToast = (type, message) => {
      Toast.show({
        text: `${message}`,
        type: type,
        position: "top",
        duration: 3000
      });
    };
    function isUserEqual(googleUser, firebaseUser) {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (
            providerData[i].providerId ===
              firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()
          ) {
            // We don't need to reauth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    }
    function onSignIn(googleUser) {
      console.log("Google Auth Response", googleUser);
      // We need to register an Observer on Firebase Auth to make sure auth is initialized.
      var unsubscribe = firebase
        .auth()
        .onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
            // Sign in with credential from the Google user.
            firebase
              .auth()
                .signInAndRetrieveDataWithCredential(credential).then((res) => {
                    console.log("user sign in ", res)
                    if (res.additionalUserInfo.isNewUser) {
                         firebase.database().ref("/users/" + res.user.uid).set({
                        email: res.user.email,
                        profile_pic: res.additionalUserInfo.profile.picture,
                        first_name: res.additionalUserInfo.profile.given_name,
                        last_name:res.additionalUserInfo.profile.family_name,
                            created_at:Date.now()
                    })
                    } else {
                        firebase.database().ref("/users/" + res.user.uid).update({
                            last_logged_in:Date.now()
                        })
                    }
                   
                }).then((snapshot) => {
                  console.log("snapshot",snapshot)
              })
              .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
    }
    const signInWithGoogleAsync=async()=> {
      try {
        const result = await Google.logInAsync({
        //   androidClientId: YOUR_CLIENT_ID_HERE,
            behavior:"web",
          iosClientId: "485564852774-2j0cfs9mhfn27vef811tj4ksssb6k4jg.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        });

          if (result.type === "success") {
              onSignIn(result)
          return result.accessToken;
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    }
    const loginUser = () => {
      setLoading(true);
      try {
        
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
            .then(res => {
                setLoading(false);
            navigation.navigate("Todo List");
          })
            .catch(err => {
                            console.log(err.message);

            showToast("danger", err.message);
            setLoading(false);

            return;
          });
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <Container style={styles.container}>
      <Form>
        <Item floatingLabel>
          <Label>Email</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
          />
        </Item>
        <Item floatingLabel>
          <Label>Password</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={text => setPassword(text)}
          />
        </Item>
        {loading ? (
          <Spinner />
        ) : (
          <Button
            style={{ marginTop: 20 }}
            full
            rounded
            success
            onPress={loginUser}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </Button>
        )}
        {loading ? (
          <Spinner />
        ) : (
          <Button
            style={{ marginTop: 20 }}
            full
            rounded
            dark
            onPress={signInWithGoogleAsync}
          >
            <Text style={{ color: "white" }}>Sign in with Google</Text>
          </Button>
        )}
      </Form>
      <View style={styles.register}>
        <Text>Don't have a account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Sign Up");
          }}
        >
          <Text style={{ color: "blue", textDecorationLine: "underline" }}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20
  },
  register: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20
  }
});
