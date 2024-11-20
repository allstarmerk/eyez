import { inverseFormatSlug} from '@/lib/slugs'
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRouter } from 'expo-router';
import Toast from 'react-native-root-toast';


export default function JoinPage() {
  const [roomId, setRoomId] = useState("");
  const client = useStreamVideoClient();
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) return;
    
     const slug = inverseFormatSlug(roomId);

     const call = client?.call("default", slug);
  

     call?.get().then((callResponse) => {
      console.log( callResponse);
      router.push(`/(home)/${slug}`);

     }).catch((reason) => {
      console.log(reason.message);

      Toast.show(
        "Error: Looks Like The Room Dosent Exist",
        {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
        }
      )

    });
  };




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
        Enter The Room Name To Join:
        </Text>
        <TextInput
        placeholder= "example: Blue Big Zebra"
        value={roomId}
        onChangeText={setRoomId}
        style={{
          padding: 20,
          width: "100%",
          backgroundColor: "white",
        }}
        />
 <TouchableOpacity
    onPress ={handleJoinRoom}
    style={{
      padding: 20,
      backgroundColor: "blue",
      width: "100%",
      justifyContent: "center",
    }}
    >
      <Text>
      
       
        Join Room
       
       </Text>
    </TouchableOpacity>
    </View>


  )
}

