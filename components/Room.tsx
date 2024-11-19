import { View, Text } from 'react-native'
import React from 'react'
import { CallContent } from '@stream-io/video-react-native-sdk'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function CallRoom({slug}: {
    slug: string
}) {
  return (
    <View>
        <GestureHandlerRootView style= {{ flex: 1 }}>

      <CallContent  /> 
        </GestureHandlerRootView>
    </View>
  );
}