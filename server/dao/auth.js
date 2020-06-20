module.exports = {
  check: async ({ redirectLink }, context) => {
    const { isUnauthenticated, req, getUser } = context;
    console.log(process.env.EXAMPLE);

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
