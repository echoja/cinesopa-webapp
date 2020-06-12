import model from '../mongoose/model.js';

export const auth = {

  check: async({redirectLink}, context) => {
    console.log(redirectLink);
    if(context.isUnauthenticated()) return "LOGIN_REQUIRED";
    else return "OK"
  }
}
