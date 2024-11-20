import { SignedIn, useAuth, useUser } from '@clerk/clerk-expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Call, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Dialog from "react-native-dialog";
import { FlatList } from 'react-native-gesture-handler';

export default function IndexScreen() {
  const client = useStreamVideoClient(); 
  const { user } = useUser();
  const [calls, setCalls] = useState<Call[]>([]);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { signOut } = useAuth(); // this is the sign out function using clerk

  const fetchCalls = async () => {
     if (!client || !user ) return;  

     const {calls} = await client.queryCalls({
      filter_conditions:isMyCalls ? {
        $or: [
          {created_by_user_id: user.id},
          {members: { $in: [user.id] } },
        ],
  } 
  : {},
  sort: [{field: "created_at", direction: -1}],

  watch: true,
     });
     const sortedCalls = calls.sort((a,b) => {
      return b.state.participantCount - a.state.participantCount;
     });
      setCalls(sortedCalls);
    };

useEffect(() => {
fetchCalls();
}, [isMyCalls]);

const handleRefresh = async () => {
  setIsRefreshing(true);
  await fetchCalls();
  setIsRefreshing(false);
};

const handleJoinRoom = async (id: string) => {
  router.push(`/(home)/${id}`);
};

  return (
    <View>
     <TouchableOpacity
     style={{
      
     position: 'absolute',
     top: 20,
     right: 20,
     zIndex: 100,
    }}
     onPress={() => setDialogOpen(true)}
     >
     <MaterialCommunityIcons name="logout" size={24} color="#5f5DEC" />
     </TouchableOpacity>


      <Dialog.Container visible={dialogOpen}> 
        <Dialog.Description>
          Are you sure you want to logout? 
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button 
        label="Logout" 
        onPress={async() => {
          await signOut();
          setDialogOpen(false);
        }}
         />

      </Dialog.Container>
      <FlatList
        data = {calls}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh = {handleRefresh}
        contentContainerStyle = {{
          padding: 100,
        }}
        renderItem = {({item}) => (
          <TouchableOpacity
            key = {item.id}
            onPress = {() => handleJoinRoom(item.id)}
            disabled = {item.state.participantCount ===0}
            style = {{
              padding: 20,
              backgroundColor: 
              item.state.participantCount === 0 ? "gray" : "white",
              flexDirection: "row",
              alignItems: "center",
              gap:10,
            }}
             >
            <Text>{item.id}</Text>



          </TouchableOpacity> 


        )}
      />
      </View>
  );
}