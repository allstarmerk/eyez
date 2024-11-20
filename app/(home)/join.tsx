import { inverseFormatSlug} from '@/lib/slugs'
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRouter } from 'expo-router';


export default function JoinPage() {
  const [roomId, setRoomId] = useState("");
  const client = useStreamVideoClient();
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) return;
    {
     const slug = inverseFormatSlug(roomId);

     const call = client?.call("default", slug);


     call?.get().then((callResponse) => {
      console.log( callResponse);
      router.push(`/(home)/${slug}`);

    });
  }




  return (
    <View style = { {
      flex: 1,
    }} >
      <Text
        style = {{
          padding: 20,
          fontWeight: "bold",

        }}
        >  
        Enter The Room Name
        </Text>
        <TextInput
        placeholder= "e.g Black Purple Tiger"
        value={roomId}
        onChangeText={setRoomId}
        style={{
          padding: 20,
          fontSize: 20,
        }}
        />
 <TouchableOpacity
    onPress ={handleJoinRoom}
    style={{
      backgroundColor: "black",
      padding: 20,
      borderRadius: 5,
      width: "100%",
      justifyContent: "center",
    }}
    >
      
        Join Room

    </TouchableOpacity>


    </View>
  )
}
}