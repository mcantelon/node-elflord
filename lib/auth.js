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
