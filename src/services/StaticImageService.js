import ApiContants from "../assets/constants/ApiContants";

const getFlagIcon = (
    code = 'DE',
    style = ApiContants?.COUNTRY_FLAG?.STYLE?.SHINY,
    size = ApiContants?.COUNTRY_FLAG?.SIZE[64],
) => {
    if (ApiContants?.COUNTRY_FLAG) {
        return `${ApiContants.COUNTRY_FLAG.BASE_URL}/${code}/${style}/${size}.png`;
    } else {
        console.log("ApiContants.COUNTRY_FLAG is not defined");
        return null;
    }
};

const getLogo = imageId =>
    `${ApiContants.STATIC_IMAGE.BASE_URL}/logo/${imageId}.png`;

const getPoster = (imageId, quality = ApiContants.STATIC_IMAGE.QUALITY.SD) =>
    `${ApiContants.STATIC_IMAGE.BASE_URL}/poster/${quality}/${imageId}.png`;

const getGalleryImage = (
    imageId,
    size,
    quality = ApiContants.STATIC_IMAGE.QUALITY.SD,
) =>
    `${ApiContants.STATIC_IMAGE.BASE_URL}/gallery/${size}/${quality}/${imageId}.png`;

export default { getFlagIcon, getLogo, getPoster, getGalleryImage };
