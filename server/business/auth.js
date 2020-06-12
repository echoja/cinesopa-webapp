import model from '../mongoose/model.js';

export const auth = {

  check: async({redirectLink}, {isUnauthenticated, req}) => {
    
    if(isUnauthenticated()) {
      req.session.redirectLink = redirectLink;
      return "LOGIN_REQUIRED";
    }
    else return "OK"
  }
}
