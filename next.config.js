module.exports = {
  //radi i bez ovog
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    return config;
  },

  images: {
    domains: [
      "i.imgur.com",
      "imgur.com",
      "photos.marinetraffic.com",
      "unsplash.com",
      "source.unsplash.com",
    ],
  },
};
