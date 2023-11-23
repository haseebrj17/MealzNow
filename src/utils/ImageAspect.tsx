import { Image } from "react-native";

interface getImageAspectRatioProps {
    uri: string;
    callback: (aspectRatio: number) => void;
}

export const getImageAspectRatio = (props: getImageAspectRatioProps) => {
    const { uri, callback } = props;

    Image.getSize(
        uri,
        (width, height) => {
            if (width && height) {
                callback(width / height);
            }
        },
        (error) => {
            console.error(`Couldn't get the image size, check the URI: ${error}`);
            callback(1); // Fallback aspect ratio
        }
    );
};