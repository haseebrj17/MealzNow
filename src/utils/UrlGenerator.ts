interface TransformImageUrlProps {
    originalUrl: string;
    size: string;
}

export const transformImageUrl = ({ originalUrl, size }: TransformImageUrlProps): string => {
    const baseUrl = `https://ik.imagekit.io/FoodsNowGmbH${size}/sliders/`;
    const urlParts = originalUrl.split('/');
    const relevantParts = urlParts.slice(4);
    const transformedUrl = baseUrl + relevantParts.join('/');
    return transformedUrl;
};
