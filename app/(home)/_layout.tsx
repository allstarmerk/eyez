import { Redirect, Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { View } from 'react-native';

import {LogLevel, name, StreamVideo, StreamVideoClient, User, } from '@stream-io/video-react-native-sdk';

const apiKey = process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;

if( !apiKey ) {
  throw new Error("Missing GetStream API Key please set it in your .env file"

  );
}


export default function CallRoutesLayout() {
  const { isSignedIn } = useAuth();
  const {user: clerkUser} = useUser();

    if (!isSignedIn || !clerkUser || !apiKey ) {
      return <Redirect href={"/(auth)/sign-in"} />;
    }
    

const user: User = {
    id: clerkUser.id,
    name: clerkUser.fullName || ''
  };

    const tokenProvider = async () => {
    const response = await fetch(
      `${process.env.Expo_PUBLIC_API_URL}/generateUserToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: clerkUser.id,
          name: clerkUser.fullName!,  //passes user information up to the end point we created in .env file process.env.Expo_PUBLIC_API_URL
          image: clerkUser.imageUrl!,
          email: clerkUser.primaryEmailAddress?.toString()!,
        }),
      }
    );
    const data = await response.json();
    return data.token;
  };




    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user,
      tokenProvider,
      options: {
        logger: (logLevel: LogLevel, message: String, ...args: unknown[]) => {},  
      },
    });

  return (
    <SafeAreaView style={{ flex: 1 }}>
     <StreamVideo client = {client} >  

      <Tabs 
        screenOptions={({ route }) => ({
         header: () => null,
         //CHANGES THE COLOR OF THE ICONS
         tabBarActiveTintColor: '#5F5DEC',
        tabBarStyle: {
            display: route.name === "[id]" ? "none" : "flex", //This is what causes it to go to full screen when you click on join call
          },
          tabBarLabelStyle: {
            zIndex: 100,
            paddingBottom: 5,

          },
        })}
      >
        <Tabs.Screen
            name="index"
            options={{
                title: 'Call List',
                tabBarIcon: ({ color }) => (
                    <Ionicons name= "call-outline" size={24} color={color} />
                ),
            }}
        />
        <Tabs.Screen name="[id]" options={{
          title: 'Start A Call',
          unmountOnBlur: true,
          header: () => null,
          tabBarIcon: ({ color }) => (
            <AntDesign name="videocamera" size={24} color={color} />
          ),

        }} />
        <Tabs.Screen
            name="join"
            options={{
                title: 'Join Call',
                headerTitle: 'Enter Call ID',
                tabBarIcon: ({ color }) => (
                    <AntDesign name= "addusergroup" size={24} color={color} />
                ),
            }}
        />

       </Tabs> 
       </StreamVideo>
    </SafeAreaView>
   );
}   


