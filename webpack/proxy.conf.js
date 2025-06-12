function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/health', '/graphql', '/graphiql'];
  return [
    {
      context: serverResources,
      target: `http${tls ? 's' : ''}://localhost:8080`,
      secure: false,
      changeOrigin: tls,
    },
    {
      context: ['/prediccion-api'],
      target: 'https://enfermedades-ml.fly.dev',
      pathRewrite: { '^/prediccion-api': '/graphql' }, // Redirige a /graphql para que la URL final sea /graphql/graphql
      secure: false,
      changeOrigin: true,
    },
  ];
}

module.exports = setupProxy;
