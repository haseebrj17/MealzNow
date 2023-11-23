interface TransformImageUrlProps {
    originalUrl: string;
    size: number;
}

export const transformImageUrl = ({ originalUrl, size }: TransformImageUrlProps): string => {
    const baseUrl = `https://ik.imagekit.io/FoodsNowGmbH${size}/sliders/`;
    const urlParts = originalUrl.split('/');
    const relevantParts = urlParts.slice(4);
    const transformedUrl = baseUrl + relevantParts.join('/');
    console.log(transformedUrl);
    return transformedUrl;
};
