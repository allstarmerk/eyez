import * as React from 'react'
import { TextInput, Button, View, Platform, Text, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { KeyboardAvoidingView } from 'react-native'
import StyledButton from '@/components/StyledButton'
import { useState } from 'react'

export default function SignUpScreen() { //This Sign up code is all from the clerk documentation
  const { isLoaded, signUp, setActive } = useSignUp() //Just may have to tweak for 2fAuth and styling
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error:", err.errors[0].message);
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace("/")
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert(
        "Error:",
        "You Have Entered an Incorrect Code. \n\nPlease Try Again."
      )
      }
    
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={{
      flex: 1,
      backgroundColor: "blue",
      justifyContent: 'center',
      paddingHorizontal : 20,

    }}  
    >
      {!pendingVerification && (
        <View
         style={{   
            gap: 10, 
         }}
        >

           <Text 
            style={{
              color: 'white',
              fontSize: 19,
              textAlign: 'center',
              marginBottom: 20,
            }}


           >
              {"Enter Your Email and Password to Get Started!"}
          </Text>
          <TextInput
            style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              width: '100%',
            }}

            autoCapitalize="none" 
            value={emailAddress}
            secureTextEntry={false}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            width: '100%',
          }}
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <StyledButton title="Sign Up" onPress={onSignUpPress} />
        </View>
        
      )}
      {pendingVerification && (
        <>
          <Text
          style={{
            color: 'white',
            textAlign: 'center',   //2fa Verification message & styling
            fontSize: 19,
            marginBottom: 20,
      
          }}
          >
            Check your email for a verification code
            </Text>
          <TextInput 
          value={code} 
          style={{ 
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            width: '100%',
            
          }}
          placeholder="Code..." 
          onChangeText={(code) => setCode(code)} 
          />
          <StyledButton title="Verify Email" onPress={onPressVerify} />
        </>
      )}


    </KeyboardAvoidingView>
  );
}