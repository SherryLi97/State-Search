module.exports = {
    client: {
      service: {
        name: 'mydemo',
        // GraphQL API
        url: 'http://localhost:4000/graphql',
      },

      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }