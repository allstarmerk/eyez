import Room from '@/components/Room';
import {Call, CallingState, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { generateSlug } from "random-word-slugs";
import Toast from 'react-native-root-toast';
import { copySlug } from '@/lib/slugs';

export default function CallScreen() { //This page responsible for calling
  const { id } = useLocalSearchParams(); 
  const [call, setCall]= useState<Call | null>(null) //keeps track of the state of call
  const client = useStreamVideoClient(); //client is used to make calls
  const [slug, setSlug] = useState<string | null>(null); //state to keep track of slug
  
  useEffect(() => {
       // either join another room id
       //or leave a room foranother room id
      let slug: string;

      if (id!=="(call)"&& id ){  //&& id making sure id exhists
                                  //Then join a exhist
      slug = id.toString(); 
       const _call = client?.call("default",slug);
       _call?.join({create:false}).then(()=> { 
        setCall(_call);
       });
       
      }else{  

        slug = generateSlug(3, {  //creates random word phrase to make meeting code
            categories:{ 
              adjective: ["color", "personality"],
              noun: ["animals", "food"],
            },
          });
      



    const _call = client?.call("default",slug); //under scor call because its geting passed into
       _call?.join({create: true}).then(()=> {             //seting ccit as the "demo room"
     //duble check here                                  //above is actually joining call now. If dosent exhist then it gets created
       Toast.show(
        "The call was created Sucessfully \n Tap Here to COPY the meeting ID to  Share",
       {
       duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        onPress: async ( )  => {
          copySlug(slug);
        },
        }
       );

       
       
       setCall(_call);
       });
    }


    setSlug(slug);
  }, [id, client])




                     
 useEffect(() => {
  //clean up function runs whe componet unmounts
  if(call?.state.callingState !== CallingState.LEFT) {
    call?.leave                                         //Logic to leave the call everytime user leaves the screen
    return () => {
      call?.leave();
    }
  }
 }, [call])

 if (!call||!slug ) {
  return (                        //if no call or slug then there will be loading indicator
    <View style = {{flex:1, justifyContent: "center", alignItems: "center"}} >                               
        <ActivityIndicator size="large"  />
        </View>
  );
}
    
    
  return(     //Bellow passes the "call" object to the StreamCall component
    <StreamCall call={call}>  
     <Room slug={slug}  />
    </StreamCall>
  );
}