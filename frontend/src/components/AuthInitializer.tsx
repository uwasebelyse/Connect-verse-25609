import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../state/auth/authApi';
import { setCredentials } from '../state/auth/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (user && token) {
      dispatch(setCredentials({ user, token }));
    }
  }, [user, token, dispatch]);

  return null; // This component doesn't render anything
};

export default AuthInitializer; 