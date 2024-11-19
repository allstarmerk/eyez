import 'react-native-reanimated';
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { RootSiblingParent } from 'react-native-root-siblings';
  

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

if (!publishableKey) {
  throw new Error(
    'Missing Publiic Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env located on your clerk managment profile',
  )
}





export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache ={tokenCache}>
      <ClerkLoaded>
      <RootSiblingParent>
        <Slot />
      </RootSiblingParent>
      </ClerkLoaded>
    </ClerkProvider>
  );
}