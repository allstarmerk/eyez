import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native'

import React, { useCallback, useState } from 'react'
import { Link, useNavigation, useRouter } from "expo-router"
import { useSignIn } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons';
import StyledButton from '../../components/StyledButton'; 
import SignInWithOauth from '../../components/SignInWithOauth';
import { Image } from 'react-native';

export default function LogInPage() {

  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        //This section was pulled from clerk documentaton and is not tested
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
       //Error handling for when incorect user or pass is entered. message bellow will show frontend
      Alert.alert(
        "Login Error:",
        "Looks like you have entered an incorrect email or password. \n\nPlease try again."

      );
    }
  }, [isLoaded, emailAddress, password]);


  return ( //2 lines bellow are making sure when on ios or android the input fields are not covered by the keyboard ande move up when keyboard appears
    <KeyboardAvoidingView  //keyboard avoid because the keyboard can cover the input if not
      behavior={Platform.OS === "ios" ? "padding" : undefined}  //uses padding optionto avoid keyboard view issues
      style={{
        flex: 1,
        backgroundColor: "blue", // color of the main center portion of sign in screen
        paddingHorizontal: 20,
        justifyContent: 'center',
        gap: 5,
      }}
    >
       <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          alignSelf: 'stretch',
          alignItems: 'center',
          marginTop: 0,
        }}
      >
        <Image
          source={require('../../assets/eyez-logo2.jpg')} 
          style={{
            width: '100%',
            height: 50, 
            resizeMode: 'cover',
          }}
        />
      </View>


      
         <MaterialIcons
          name="video-call"
          size={160}
          color="white"
          style={{
            alignSelf: 'center',
          }}
         />



      <TextInput
        autoCapitalize="none"
        style={{
          width: '100%',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          
        }}
        value={emailAddress}
        placeholder="Email or Username"
        onChangeText={(emailAddress)=> setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        style={{
          width: '100%',
          backgroundColor: 'white', //styling for pasword fied
          padding: 20,
          borderRadius: 10,
          
        }}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password)=> setPassword(password)}

       />
       {/*divider */}
       <View
         style={{
           borderBottomColor: 'white',
           borderBottomWidth: 1,
           marginVertical: 20,
         }}

       />
      <StyledButton title="Sign In" onPress={onSignInPress} />
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          
        }}
      >
        OR  
      </Text>
      <SignInWithOauth /> 

       {/*divider */}
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            marginVertical: 20,
          }}
        />
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
            }}



        >
        Don't have an account?</Text>
        <Link href="/sign-up">
          <Text
           style={{ 
              color: 'white',
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}
          >

            Sign up
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
