var password;

// module requires password be passed to it so it's global to module
module.exports = function(authorizedPassword) {
  password = authorizedPassword;
  return exports;
}

exports.handleAuthorization = function(res, submittedPassword, cb) {
  exports.send401ifWrongPassword(
    res,
    submittedPassword,
    password,
    cb
  );
}

exports.send401ifWrongPassword = function(
  res,
  submittedPassword, 
  realPassword,
  cb
) {
  (realPassword == '' || submittedPassword == realPassword)
    ? cb()
    : res.json({}, 401);
}
