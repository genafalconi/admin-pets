import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT, VERIFY_ADMIN_TOKEN } from '../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import { decrypt } from './encryptToken';

export default function ValidateSesion() {

  const [validToken, setValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let userAuth = localStorage.getItem('user') && JSON.stringify(localStorage.getItem('user'))
  let token = localStorage.getItem('token') && JSON.stringify(localStorage.getItem('token'))

  if (!userAuth && !token) {
    const query = new URLSearchParams(window.location.search);
    token = decrypt(query.get("token"));
    userAuth = decrypt(query.get("user"));
  }

  const dispatch = useDispatch();

  const verifyTokenValidity = useCallback(async () => {
    try {
      dispatch(VERIFY_ADMIN_TOKEN({ user: userAuth, idtoken: token }))
        .then((res) => {
          setValidToken(res.payload);
          setIsLoading(false);
          if (validToken) {
            localStorage.setItem('token', token)
            localStorage.setItem('user', userAuth)
          } else {
            dispatch(LOGOUT())
          }
        });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [dispatch, token, userAuth]);

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
        verifyTokenValidity();
      } else {
        setIsLoading(false);
      }
    };
    verifyToken();

  }, [verifyTokenValidity, token, userAuth]);

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