export default {
  providers: [
    {
      domain: "accounts.google.com",
      applicationID: "your-google-client-id",
    },
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    }
  ],
};