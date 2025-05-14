import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE,
  bcrypt_salt_round : process.env.BCRYPT_SALT_ROUND,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_membership_secret: process.env.JWT_MEMBERSHIP_SECRET,
  jwt_membership_expires_in: process.env.JWT_MEMBERSHIP_EXPIRES_IN,
  cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SCERET,
  payment_verify_url:process.env.PAYMENT_VERIFY_URL,
  reset_password_ui_url:process.env.RESET_PASSWORD_UI_URL,
  google_client_id:process.env.GOOGLE_CLIENT_ID,
  google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
  google_redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  apple_client_id: process.env.APPLE_CLIENT_ID,
};