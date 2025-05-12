import { google } from "googleapis";
import config from "./index"

const oauth2Client = new google.auth.OAuth2(
    config.google_client_id,
    config.google_client_secret,
    config.google_redirect_uri
);


export default oauth2Client;