const domain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ?? "https://organic-grouper-61.clerk.accounts.dev";

export default {
  providers: [
    {
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain,
      // Must match the Clerk JWT Template name used by Convex's Clerk integration
      applicationID: "convex",
    },
  ],
};
