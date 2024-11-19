import { SignedIn, useAuth } from '@clerk/clerk-expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Dialog from "react-native-dialog";

export default function IndexScreen() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { signOut } = useAuth() // this is the sign out function using clerk

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
      <Text>Welcome dude</Text>


      <SignedIn>
        <Text>Hey, you're signed in!</Text>
        </SignedIn>

    
    </View>
  );
}