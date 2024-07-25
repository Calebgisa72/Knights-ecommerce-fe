import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { verifyUser } from '../../redux/actions/verifyingEmailAction';
import { resetState } from '../../redux/reducers/verifyEmailReducer';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { verify, loading, error } = useSelector((state: RootState) => state.verifyEmail);

  useEffect(() => {
    if (token) {
      dispatch(verifyUser(token));
    }

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, token]);

  // Extract text from ReactNode

  return (
    <div className="min-h-[50vh] h-auto w-full flex items-center justify-center py-10 px-4 bg-transparent1">
      {loading && (
        <div className="min-w-[90%] flex flex-col items-center justify-center gap-y-6 bg-white h-[300px] md:min-w-[500px] md:max-w-[500px]">
          <p className="min-w-[100%] text-primary text-lg md:text-2xl font-medium text-center">Verifying your email</p>
          <Loader2 strokeWidth={1.5} className="text-primary animate-spin-slow" />
        </div>
      )}
      {!loading && !error && verify && (
        <div className="min-w-[90%] flex flex-col items-center justify-center gap-y-6 bg-white h-[300px] md:min-w-[500px] md:max-w-[500px]">
          <p className="min-w-[100%] text-primary text-lg md:text-2xl font-medium text-center">
            Email verified successfully!
          </p>
          <a href="/login" className="text-orange text-sm md:text-lg font-medium">
            Login
          </a>
        </div>
      )}
      {error && !loading && (
        <div className="min-w-[90%] flex flex-col items-center justify-center gap-y-6 bg-white h-[300px] md:min-w-[500px] md:max-w-[500px]">
          <p className="min-w-[100%] text-primary text-lg md:text-2xl font-medium text-center">Something went wrong</p>
          <p className="min-w-[100%] text-primary text-sm md:text-lg font-normal text-center">
            Try again or contact support
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
