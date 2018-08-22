module.exports = {
  typescript: true,
  src: './src',
  wrapper: 'src/docs/Wrapper',
  modifyBundlerConfig: config => {
    console.log(config);

    return config;
  }
};
