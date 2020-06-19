module.exports = {
  check: async ({ redirectLink }, context) => {
    console.log(context);
    const { isUnauthenticated, req, getUser } = context;
    if (isUnauthenticated()) {
      req.session.redirectLink = redirectLink;

      return {
        isAllow: "LOGIN_REQUIRED",
      };
    } else
      return {
        isAllow: "OK",
        user: getUser(),
      };
  },
};
