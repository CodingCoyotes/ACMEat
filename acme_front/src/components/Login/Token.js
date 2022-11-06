//import { useState } from 'react';
//
//export function useToken() {
//  //get token from local storage
//  const getToken = () => {
//    const tokenString = localStorage.getItem('token');
//    const userToken = JSON.parse(tokenString);
//    return userToken?.token
//  };
//
//  const [token, setToken] = useState(getToken());
//
//  //set token to local storage and save it into token
//  const saveToken = userToken => {
//    localStorage.setItem('token', JSON.stringify(userToken));
//    setToken(userToken.token);
//  };
//
//  return {
//    setToken: saveToken,
//    token
//  }
//}
//
//export function removeToken () {
//  localStorage.removeItem('token');
//}