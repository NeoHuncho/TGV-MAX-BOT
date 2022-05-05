import admin from "firebase-admin";

const initFirebase = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(service_account),
  });
};
const service_account = {
  type: "service_account",
  project_id: "tgv-max-weekends",
  private_key_id: "23099d0266a0741e6115b008f178e0321f73ac41",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbTSR/P+QlZAyt\n/FpkMxTydPiS24xRrLa48IazjeAkWc6n2bCUbm6qJ6WkFPWP5TpWB46U8xg1POOd\ncdW6n39XaFT0bDzKNc83MawGstim7p8RDb+wZhdhSSW4k6R2gXVXi6EEkcEONpAk\nwsRhhs+ouiXnlSJDLD7dfx4HOTlzPOcqdEU4qylYgTrVRKEK5Fd+n8VU59MI/OW4\ndVwej8NdKFlXSHtoKbrh2OrKtTHXBtjI9/s+oPOGTOJsy26dIJAiA/BlS4fM75FL\nEIVkh8O1kakHcg80+OvN0Wzpalh68vkceIC5bATCu5xBYm5/SlLkLDVsdvrgYVWz\nNLZA2jH3AgMBAAECggEAGi7dsAEK1kQEbN7M/rBH901r7Zd062jO8B8XlhHXCcAH\nN8HP9AjeAZwg3175P/2YYh5zhukh93ProSgEN/dEbEUypMl/gI0Szn40ZyBXVFGi\ngEC/UD+q2Zyyz5TLyrJY4OOfjTzHFfwBvcHbUeGXTYfcGrLoQlONYJiwFyCym/AY\nLGKSrz4kWw2+fJ216LFQkjRTj7u6dGjihIaQm3vNoltz1dCTLnrQK/owT3vfyvP+\ni1E3857sKTz8vtTMvxKF4kjqbyOfkGnF+GHvj9gEEplQoekREes6NNgtkAEiKx69\nWKqlY09kODNpNs+6oiKSu83Dk81+dOfy1VYwfBSrMQKBgQD+yOK4mEyO94Vh7a4F\nT91S78C1g1iagOC0thdzZS/P0e6DCoq5Wmhe1FBM9ZVNdv72M56pythMSs/Kxsh4\nJ6PlYGbn7Oq2umNVT62dGC4gjp0U7jR7+kZyPM9EBdzMMPLQvCwS70JHqpJ8el/g\n+mFzOE6edzKW/iP7NyHnxJBEWwKBgQDcWO27l6PHr4Bdyh1dEzx1OsJYCLjJgd8y\nxgBNHsjDEuD+PRE4JksTuOpjMUWEv7PRl9JDqW7XV85L7671jArCMutKYeOH8BBa\n4jKCgwXzKG/Q6YbwM2FxCS0uI7L+EhcWiDauX+T2A3lHOhPjooidEaSYUxYeqcdR\noX14Ul+LlQKBgD3iMR9A7qdy+1Sz1Ca6JTm1vgrYYjb0wp9h8wQ2OYyyosn1T4iB\nqwQNcYufwqnUE01dcFYxTKQLL7lC2wJELozSA2yloMTNNL9N4Q9dBicmPIUO7nSG\nb4Hjvzv4aI63/OIyMkpPDrw1c+sEFjGg3vaLYJ0guoruI3MrCvMuTRQtAoGAX9Xt\n0CFsAnW6hxBZJRowuWwNCu0AMeRih1rG1sQE3ZNgeDNnQdyl2rYae3n6mnomY4p8\n0SDoLJDsEOr2VaXLKButanSY2Y74Dg9DmLAT7mYv+9UV83LldpxfIio0t3x2vj4Q\nSlc65iUsomYIMIGImYgK5pV8kWmWX1K1l5d8JuECgYEAyngMX1z8kra602WeLv2p\n0JbvuMAN7nN1RtGvOfngvCIBHrZ7MRnUhMZWOMp5yjrG3oYvyHWgrVvEEZz5QLA3\n1MUo8L+x0/olsdnAyYueXI6FWi1UPIYDO+Bz+6HubHrr2VgBw2dJFxiqVqKLWpi9\nGVoVGpXAw4ltGTnzVvsPa9U=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-b9jz6@tgv-max-weekends.iam.gserviceaccount.com",
  client_id: "104924463797411927483",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b9jz6%40tgv-max-weekends.iam.gserviceaccount.com",
};

export default initFirebase;
