import * as Clipboard from "expo-clipboard";
import Toast from 'react-native-root-toast';

export const formatSlug = (slug: string| null) => {
    if (!slug) return "";

    return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) //Capitalize each
    .join(" "); //Join the words with spaces
    };


export const copySlug = async (slug: string | null) => {  //helper functio to copy the meeting room name
    if (!slug) return;
    
        await Clipboard.setStringAsync(formatSlug(slug)); 
        //Format slug makes it so slug: "happy-blue-dog" becomes slug: "happy blue dog"

        Toast.show("Copied to clipboard", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
        });
    };

