module.exports = {
  // In the production server the static dist files should be in the subfolder stated here.
  publicPath: process.env.NODE_ENV === "production" ? "/bus-dashboard/" : "/"
};
