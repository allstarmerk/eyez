import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CallContent } from '@stream-io/video-react-native-sdk'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { copySlug, formatSlug } from '@/lib/slugs'

export default function CallRoom({slug}: {slug: string}) {
const router = useRouter();

  return (
    <View>
        <View
            style= {{
                
            position: "absolute",
             top: 10,
            left: 10,  //Top left we will put the slug aka the meeting code / combo
            zIndex: 100,
              }}
        >
            <RoomId slug={slug} />
        </View>


        <GestureHandlerRootView style= {{ flex: 1 }}>

      <CallContent onHangupCallHandler={() => router.back()}  /> 
        </GestureHandlerRootView>
    </View>
  );
}

const RoomId = ({slug}: {slug: string}) => {
    return (
    <TouchableOpacity
       onPress={() => copySlug(slug)} //Need to create helper function to copy slug
       style = {{                       // function to If somone clicks on the meeting id at top left screen it will copy to clipboard
           backgroundColor: "black",
           padding: 10,
           borderRadius: 5,
       }}
       >
       <Text 
         style = {{
              color: "white",
              
         }}
          >                           
       call ID: {formatSlug(slug)}  
       </Text>
       </TouchableOpacity>
  );
 };

