import { View, Text, TouchableOpacity } from 'react-native';


export default function StyledButton({ 
    title, 
    onPress, 
    style,
}: {
    title: string;
    onPress: () => void;
    style?: any;
}) {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'black', //color of the sign in button //color of button i created
        padding: 10,
        borderRadius: 5,
        width: '100%',
        ...style,
      }} 
    >
    <Text
      style={{
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
      
    >
       {title}
     </Text>
    </TouchableOpacity>
  );
}