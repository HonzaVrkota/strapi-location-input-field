module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: env("AWS_ACCESS_KEY", ""),
      secretAccessKey: env("AWS_SECRET_KEY", ""),
      region: "eu-central-1",
      params: {
        Bucket: env("AWS_BUCKET", ""),
      },
    },
  },
});
