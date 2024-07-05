import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setCredentials } from '../../redux/reducers/authReducer';
import handleError from '../../utils/errorHandler';
import { fetchCart } from '../../redux/actions/cartAction';

const OtpPage = () => {
  interface OtpForm {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
    sixth: string;
  }

  const initialForm = {
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: ''
  };

  const [otpForm, setOtpForm] = useState<OtpForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const { email } = useSelector((state: RootState) => state.currentUser);

  const dispatch = useDispatch<AppDispatch>();
  const fields = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'] as const;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (/^\d?$/.test(value)) {
      setOtpForm((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const allFieldsFilled = fields.every((field) => otpForm[field]);
      if (!allFieldsFilled) {
        toast.error('Fill all the OTP fields.');
        return;
      }

      const otpCode = Object.values(otpForm).join('');
      if (!email) throw Error('Something went wrong, Login again');
      const reqData = { email, otp: otpCode };
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/verify-otp`, reqData);

      if (response.status === 200) {
        dispatch(setCredentials(response.data.data.token));
        dispatch(fetchCart());
      }
    } catch (error) {
      handleError(error);
    } finally {
      setOtpForm(initialForm);
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      if (!email) throw Error('Something went wrong, Login again');
      const reqData = { email };
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/resend-otp`, reqData);

      if (response.data.data.message === 'OTP sent successfully') toast.success('OTP resent successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex bg-transparent1 items-center justify-center h-[530px]">
        <div className="bg-transparent1 sm:bg-white p-5 sm:p-10  text-black flex flex-col gap-6 items-center">
          <h2 className="font-medium text-[20px]">Verify Your Identity</h2>
          <p className="font-light text-xs sm:text-[12.3px] max-w-[281px] sm:max-w-[412px] text-center">
            Protecting your account is our priority. Please confirm your identity by providing the code sent to your
            email/phone.
          </p>

          <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
            <div className="flex gap-[17px] text-black">
              {fields.map((field) => (
                <input
                  key={field}
                  className="w-8 h-8 sm:w-[50px] sm:h-[50px] bg-white border border-grey3 border-solid text-center"
                  maxLength={1}
                  onChange={handleChange}
                  name={field}
                  value={otpForm[field]}
                />
              ))}
            </div>
            <button
              type={loading ? 'button' : 'submit'}
              className={`bg-primary text-white text-[16px] py-2 px-2 rounded-sm ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} w-60`}
            >
              {loading ? 'Loading...' : 'Verify'}
            </button>
          </form>
          <p className="font-light text-xs sm:text-[12.3px] max-w-[296px] sm:max-w-[329px] text-center">
            It may take a minute to receive verification message. Haven’t received it yet?
            <span onClick={resendOTP} className="text-orange cursor-pointer">
              Resend
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default OtpPage;
