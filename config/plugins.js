module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: "AKIAJLAVHAKDGU5HET2Q",
      secretAccessKey: "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",
      region: "eu-central-1",
      params: {
        Bucket: 'baryzive1',
      },
    },
  },
});