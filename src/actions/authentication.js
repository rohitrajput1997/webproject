/** @format */

import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

export const registerUser = (user, history) => (dispatch) => {
  axios
    .post("http://localhost:5000/api/users/register", user)
    .then((res) => history.push("/login"))
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const loginUser = (user) => (dispatch) => {
  axios
    .post("http://localhost:5000/api/users/login", user)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const logoutUser = (history) => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  history.push("/login");
};
