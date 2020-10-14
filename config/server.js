module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("URL", "http://localhost:1337"),
  admin: {
    // url: "/dashboard",
    // serveAdminPanel: true,
    auth: {
      secret: env("ADMIN_JWT_SECRET", "2e36QZ3MQ/6JQiUoSCwmF/1GUdpx+QrThmLeis/xcyn+LgwKFuwL4nRojdcgvRGL1SvAZnTzDgFH9Uopf3Gtvg=="),
    },
  },
});