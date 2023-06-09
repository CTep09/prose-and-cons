import decode from "jwt-decode";

// import { useNavigate } from "react-router-dom";

class AuthService {
  // decode the token
  getProfile() {
    return decode(this.getToken());
  }

  // if a token exists and it is not expired, then return 'true'
  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  // if a token's exp property is out of date, remove the token from
  // local storage and return 'true', i.e. "Yes, the token is expired."
  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("id_token");
      return true;
    }
    return false;
  }

  // get the token from local storage
  getToken() {
    return localStorage.getItem("id_token");
  }

  // save the token to local storage and redirect to the homescreen
  login(idToken) {
    // const navigate = useNavigate();

    localStorage.setItem("id_token", idToken);
    // navigate("/userLibrary");
  }

  // remove the token from local storage and reload the page
  logout() {
    localStorage.removeItem("id_token");
    // window.location.reload();
  }
}

export default new AuthService();
