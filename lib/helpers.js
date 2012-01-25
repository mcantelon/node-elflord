exports.homeDir = function() {
  return (process.env.HOME == undefined)
    ? process.env.USERPROFILE
    : process.env.HOME;
}
