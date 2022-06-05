import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
const initFirebase = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(service_account),
    databaseURL:
      "https://tgv-max-weekends-default-rtdb.europe-west1.firebasedatabase.app/",
  });
};
const service_account = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email:
    "firebase-adminsdk-b9jz6@tgv-max-weekends.iam.gserviceaccount.com",
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b9jz6%40tgv-max-weekends.iam.gserviceaccount.com",
};

export default initFirebase;
