// Set authenticator middleware for authentication
// authenticator is used in index.js routes
module.exports = {
  authenticator: (req, res, next) => {
    // if authenticated, then next step
    if (req.isAuthenticated()) {
      return next()
    }
    // if not authenticated, then redirect to login page
    req.flash('warningMsg', '請先登入才能使用')
    res.redirect('/users/login')
  }
}