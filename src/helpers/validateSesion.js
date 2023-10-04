import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { VERIFY_ADMIN_TOKEN } from '../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import { decrypt } from './encryptToken';

export default function ValidateSesion({ setValidUser }) {
  const dispatch = useDispatch();
  const [validToken, setValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let userAuth = localStorage.getItem('user')
  let token = localStorage.getItem('token')
  const query = new URLSearchParams(window.location.search);
  const ext_token = decrypt(query?.get("token"));
  const ext_userAuth = decrypt(query?.get("user"));

  if (userAuth !== ext_userAuth && token !== ext_token) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('user_auth')
    userAuth = ext_userAuth
    token = ext_token
  }

  const verifyTokenValidity = useCallback((user_auth, finish_token) => {
    try {
      dispatch(VERIFY_ADMIN_TOKEN({ user: user_auth, idtoken: finish_token }))
        .then((res) => {
          setValidToken(res.payload);
          setValidUser(res.payload);
          setIsLoading(false);
          if (res.payload) {
            localStorage.setItem('token', finish_token);
            localStorage.setItem('user', user_auth);
            localStorage.setItem('user_auth', res.payload);
          }
        });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [dispatch]);

  const unauthorized = () => {
    return (
      <div>
        <h1>No tenes acceso</h1>
      </div>
    )
  }

  useEffect(() => {
    const verifyToken = () => {
      if (token && userAuth) {
        verifyTokenValidity(userAuth, token);
      } else {
        setIsLoading(false);
      }
    };
    verifyToken();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
        </div>
      ) : (
        <>
          {!validToken && unauthorized()}
        </>
      )}
    </>
  );
};