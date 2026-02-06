export default {
  providers: [
    {
      domain: "accounts.google.com",
      applicationID: "182933708424-b8tv0h9a4smbnbk6hhge78rnimori34k.apps.googleusercontent.com",
    },
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    }
  ],
};