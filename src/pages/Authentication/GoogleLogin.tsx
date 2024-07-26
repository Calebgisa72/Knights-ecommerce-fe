import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { clearCredentials, setCredentials } from '../../redux/reducers/authReducer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setUser } from '../../redux/reducers/userReducer';
import toast from 'react-hot-toast';

const GoogleLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const status = searchParams.get('status');
  const token = searchParams.get('token') as string;
  const email = searchParams.get('email');
  const role = searchParams.get('role');

  useEffect(() => {
    try {
      if (status === 'success') {
        if (token) {
          dispatch(setCredentials(token));
          navigate(`${role === 'buyer' ? '/' : '/' + role + '/dashboard'}`);
        } else {
          throw new Error('');
        }
      } else if (status === 'userSuspended') {
        navigate('/suspended-account');
      } else if (status === 'otp') {
        if (email) {
          dispatch(setUser(email));
          navigate('/otp-verification');
        } else {
          throw new Error('');
        }
      } else {
        dispatch(clearCredentials());
        throw new Error('');
      }
    } catch (error) {
      toast.error('Something went wrong, Please try again or use a different sign-in method');
      navigate('/login');
    }
  }, [dispatch, email, navigate, role, status, token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] bg-background3 text-baseBlack">
      <div className="bg-black mb-10">
        <PropagateLoader color="#070F2B" />
      </div>
      <span className="text-lg pl-4">Signing in with Google</span>
      <span className="text-neutrals700 italic text-sm pl-4">Please wait a moment.</span>
    </div>
  );
};

export default GoogleLogin;
