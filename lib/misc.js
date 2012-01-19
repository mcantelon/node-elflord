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
