import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VERIFY_ADMIN_TOKEN } from '../redux/actions';
import Spinner from 'react-bootstrap/Spinner';

export default function ProtectedRoute({ children }) {

  const [validToken, setValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userAuth = useSelector((state) => state.clientReducer.user_auth);
  const token = useSelector((state) => state.clientReducer.token);

  const dispatch = useDispatch();

  const verifyTokenValidity = useCallback(async () => {
    try {
      await dispatch(VERIFY_ADMIN_TOKEN(userAuth))
        .then((res) => {
          setValidToken(res.payload);
          if(validToken) {
            localStorage.setItem('token', token)
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
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
          {!token || (token && !validToken) ? (
            unauthorized()
          ) : (
            children
          )}
        </>
      )}
    </>
  );
};