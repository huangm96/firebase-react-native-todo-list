import React from "react";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";

import { Text } from "react-native";
import { Button} from "native-base";


function GoogleSignin({ navigation }) { 
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
              .signInWithCredential(credential)
              .then(res => {
                console.log("user sign in ", res);
                if (res.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + res.user.uid)
                    .set({
                      email: res.user.email,
                      profile_pic: res.additionalUserInfo.profile.picture,
                      first_name: res.additionalUserInfo.profile.given_name,
                      last_name: res.additionalUserInfo.profile.family_name,
                      created_at: Date.now()
                    });
                } else {
                  firebase
                    .database()
                    .ref("/users/" + res.user.uid)
                    .update({
                      last_logged_in: Date.now()
                    });
                }
              })
              .then(snapshot => {
                console.log("snapshot", snapshot);
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
    const signInWithGoogleAsync = async () => {
      try {
        const result = await Google.logInAsync({
          //   androidClientId: YOUR_CLIENT_ID_HERE,
          behavior: "web",
          iosClientId:
            "485564852774-2j0cfs9mhfn27vef811tj4ksssb6k4jg.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        });

        if (result.type === "success") {
          onSignIn(result);
          return result.accessToken;
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    };
    return (
      
          <Button
            style={{ marginTop: 20 }}
            full
            rounded
            dark
            onPress={signInWithGoogleAsync}
          >
            <Text style={{ color: "white" }}>Sign in with Google</Text>
          </Button>
    )
    
}

export default GoogleSignin