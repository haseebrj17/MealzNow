import { Image } from "react-native";

interface getImageAspectRatioWithCallBackProps {
    uri: string;
    callback: (aspectRatio: number) => void;
}

interface getImageAspectRatioProps {
    uri: string;
}

export const getImageAspectRatioWithCallBack = (props: getImageAspectRatioWithCallBackProps) => {
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
            callback(1);
        }
    );
};

export const getImageAspectRatio = (uri: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        Image.getSize(
            uri,
            (width, height) => {
                if (width && height) {
                    resolve(width / height);
                } else {
                    reject(new Error('Invalid dimensions'));
                }
            },
            (error) => {
                console.error(`Couldn't get the image size, check the URI: ${error}`);
                reject(error);
            }
        );
    });
};
