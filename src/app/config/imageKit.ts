import ImageKit from "imagekit";
import config from "./index";

const imageKt = new ImageKit({
    urlEndpoint: config.imageKit_url_endpoint as string,
    publicKey: config.imageKit_public_key as string,
    privateKey: config.imageKit_private_key as string,
});

export default imageKt;