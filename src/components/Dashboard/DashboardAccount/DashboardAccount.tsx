import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PropagateLoader } from 'react-spinners';
import defaultDp from '../../../images/default.jpg';
import cloudUpload from '../../../images/cloud-upload.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import {
  fetchProfile,
  updateUserProfile,
  updateUserProfileImage,
  enableTwoFactorAuth,
  disableTwoFactorAuth
} from '../../../redux/actions/profileAction';
import { ProfileData, UpdateProfileData } from '../../../types/profileTypes';
import { BeatLoader } from 'react-spinners';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { useJwt } from 'react-jwt';

function DashboardAccount() {
  const {
    profile,
    responseMessage,
    loadingGetProfile,
    loadingUpdateProfile,
    loadingUpdateImage,
    loadingTwoFactor,
    error
  } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<AppDispatch>();

  const createdAt = new Date((profile as ProfileData).createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [fileName, setFileName] = useState('No file choosen');
  const [userEmail, setUserEmail] = useState<string>('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState((profile as ProfileData).twoFactorEnabled);

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages(Array.from(files));
      setFileName(files[0].name);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      phoneNumber: ''
    }
  });

  const onSubmit: SubmitHandler<UpdateProfileData> = (userData: UpdateProfileData) => {
    dispatch(updateUserProfile(userData));
  };

  const handleToggleTwoFactorAuth = () => {
    if (twoFactorEnabled) {
      dispatch(disableTwoFactorAuth({ email: userEmail }));
    } else {
      dispatch(enableTwoFactorAuth({ email: userEmail }));
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleChangeProfileImage = async () => {
    const newFormData = new FormData();
    images.forEach((image) => {
      newFormData.append('images', image);
    });
    dispatch(updateUserProfileImage(newFormData));
    setFileName('No file choosen');
    setImages([]);
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: (profile as ProfileData).firstName,
        lastName: (profile as ProfileData).lastName,
        gender: (profile as ProfileData).gender,
        phoneNumber: (profile as ProfileData).phoneNumber
      });
      setTwoFactorEnabled((profile as ProfileData).twoFactorEnabled);
      setUserEmail((profile as ProfileData).email);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (responseMessage) {
      toast.success(responseMessage);
    }
  }, [responseMessage]);

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const isAdmin = decodedToken?.role.toLowerCase() === 'admin';
  const isVendor = decodedToken?.role.toLowerCase() === 'vendor';

  return (
    <div className="p-7 w-full min-h-[calc(100vh-94px)]  bg-[#EEF5FF] overflow-y-scroll">
      <div className="flex flex-col gap-5">
        {(isAdmin || isVendor) && (
          <div>
            <h1 className="text-[20px] font-semibold">Your Account</h1>
            <p className="text-[14px] font-light flex items-center">
              Home &gt; <span className="hover:underline cursor-pointer mx-1">Account</span>
            </p>
          </div>
        )}

        {loadingGetProfile ? (
          <div
            className="w-full h-[calc(80vh)] flex items-center justify-center bg-white rounded-2xl border border-[#D1D1D1]"
            data-testid="loading-spinner"
          >
            <PropagateLoader color="#070f2b" />
          </div>
        ) : (
          <div className="h-auto flex flex-col gap-4 bg-white rounded-2xl border border-[#D1D1D1] p-4 sm:p-8">
            <div className="w-full flex justify-start items-start gap-x-12 flex-wrap">
              <div className="w-full sm:w-auto flex flex-col">
                <h1 className="w-full flex items-center justify-start font-poppins font-semibold text-primary text-lg">
                  Profile Information
                </h1>
                <div className="w-full sm:w-[270px] h-[300px] sm:h-[250px] mt-3 rounded-lg border border-[#D1D1D1] p-0.5">
                  {(profile as ProfileData).photoUrl ? (
                    <img
                      src={(profile as ProfileData).photoUrl as string}
                      alt="profile"
                      role="profileTest"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={defaultDp}
                      alt="profile"
                      role="profileTest"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
              <div className="mt-8 w-full sm:w-auto h-[250px] flex flex-col items-start justify-start gap-y-2">
                <h2 className="w-full flex items-center justify-start font-poppins font-semibold text-primary text-sm sm:text-base">
                  Basic Info
                </h2>

                <p className="w-full sm:w-[300px] mt-4 flex items-center justify-between">
                  <span className="flex items-center justify-start font-poppins font-normal text-primary text-sm sm:text-base">
                    Status
                  </span>
                  <span className="flex items-center justify-center gap-1 px-5 py-0.5 border border-[#D1D1D1] rounded-2xl text-sm sm:text-base">
                    <span
                      className={`w-3 h-3 rounded-full ${(profile as ProfileData).status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    {(profile as ProfileData).status}
                  </span>
                </p>
                <p className="w-full sm:w-[300px] flex items-center justify-between">
                  <span className="flex items-center justify-start font-poppins font-normal text-primary text-sm sm:text-base">
                    Member since
                  </span>
                  <span className="flex items-center justify-start font-poppins font-normal text-primary text-sm sm:text-base">
                    {createdAt}
                  </span>
                </p>
                <p className="w-full sm:w-[300px] flex items-center justify-between">
                  <span className="flex items-center justify-start font-poppins font-normal text-primary text-sm sm:text-base">
                    Role
                  </span>
                  <span className="flex items-center justify-start font-poppins font-normal text-primary text-sm sm:text-base">
                    {(profile as ProfileData).userType}
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row  items-center justify-start mt-4 sm:mt-8 gap-2 w-full sm:w-[400px]">
                  <div
                    className="w-full h-auto sm:h-[50px] border border-[#D1D1D1] p-2 rounded-md flex flex-col sm:flex-row items-center justify-start gap-y-2 gap-x-2 cursor-pointer
                    whitespace-nowrap overflow-hidden 
                    "
                    onClick={handleSelectFileClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      role="testRole"
                    />
                    <span className="flex items-center justify-center gap-1 bg-primary text-white font-poppins font-normal px-2 py-1 rounded-lg">
                      <img src={cloudUpload} alt="upload icon" role="uploadIcon" />
                      change photo
                    </span>
                    <span className="flex-1 w-full text-center sm:text-left">
                      {fileName.length > 15 ? `${fileName.slice(0, 15)}...` : fileName}
                    </span>
                  </div>
                  <button
                    className="bg-primary border border-primary rounded-lg flex items-center justify-center h-[50px] w-full sm:w-[100px] text-white font-poppins font-medium"
                    onClick={handleChangeProfileImage}
                    role="testChangeImageBtn"
                  >
                    {loadingUpdateImage ? <BeatLoader color="#ffffff" /> : 'save'}
                  </button>
                </div>
              </div>
            </div>

            <form
              className="w-full flex flex-wrap items-start justify-start gap-x-16 mt-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-start justify-start gap-y-2">
                <div className="flex flex-col items-start justify-start gap-y-0.5">
                  <p className="w-full flex items-center justify-start font-poppins font-medium text-primary text-base">
                    Firstname
                  </p>
                  <div className="h-[40px] w-full sm:w-[350px] flex items-center justify-center p-0.5 border border-[#D1D1D1] rounded-md">
                    <input
                      type="text"
                      role="testRole"
                      className="outline-none border-none w-full h-full px-4 font-poppins font-normal text-primary"
                      placeholder="firstname"
                      {...register('firstName', { required: true })}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="text-orange font-poppins font-normal text-sm">Firstname is required</span>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start gap-y-0.5">
                  <p className="w-full flex items-center justify-start font-poppins font-medium text-primary text-base">
                    Email
                  </p>
                  <div className="h-[40px] w-full sm:w-[350px] bg-[#E7EBEF] flex items-center justify-center p-0.5 border border-[#D1D1D1] rounded-md">
                    <input
                      type="email"
                      role="testRole"
                      className="bg-[#E7EBEF] outline-none border-none w-full h-full px-4 font-poppins font-normal text-primary"
                      placeholder="email"
                      value={(profile as ProfileData).email}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-y-0.5">
                  <p className="w-full flex items-center justify-start font-poppins font-medium text-primary text-base">
                    Gender
                  </p>
                  <div className="h-[40px] w-full sm:w-[350px] flex items-center justify-center p-0.5 border border-[#D1D1D1] rounded-md">
                    <input
                      type="text"
                      role="testRole"
                      className="outline-none border-none w-full h-full px-4 font-poppins font-normal text-primary"
                      placeholder="Male | Female | Other"
                      {...register('gender', { required: true })}
                    />
                  </div>
                  {errors.gender && (
                    <span className="text-orange font-poppins font-normal text-sm">Gender is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-y-2">
                <div className="flex flex-col items-start justify-start gap-y-0.5">
                  <p className="w-full flex items-center justify-start font-poppins font-medium text-primary text-base">
                    Lastname
                  </p>
                  <div className="h-[40px] w-full sm:w-[350px] flex items-center justify-center p-0.5 border border-[#D1D1D1] rounded-md">
                    <input
                      type="text"
                      role="testRole"
                      className="outline-none border-none w-full h-full px-4 font-poppins font-normal text-primary"
                      placeholder="lastname"
                      {...register('lastName', { required: true })}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="text-orange font-poppins font-normal text-sm">Lastname is required</span>
                  )}
                </div>

                <div className="flex flex-col items-start justify-start gap-y-0.5">
                  <p className="w-full flex items-center justify-start font-poppins font-medium text-primary text-base">
                    Contact No
                  </p>
                  <div className="h-[40px] w-full sm:w-[350px] flex items-center justify-center p-0.5 border border-[#D1D1D1] rounded-md">
                    <input
                      type="text"
                      role="testRole"
                      className="outline-none border-none w-full h-full px-4 font-poppins font-normal text-primary"
                      placeholder="contact no"
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^07\d{8}$/,
                          message: 'Phone number must be 10 digits and start with 07'
                        }
                      })}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm font-poppins">{errors.phoneNumber.message}</span>
                  )}
                </div>
                <button
                  className="bg-primary text-white h-[40px] flex items-center justify-center w-full sm:w-[180px] rounded-lg font-poppins font-medium mt-4 sm:mt-6"
                  role="testSaveChangesBtn"
                >
                  {loadingUpdateProfile ? <BeatLoader color="#ffffff" /> : 'Save Changes'}
                </button>
              </div>
            </form>

            {(isAdmin || isVendor) && (
              <div className="w-full sm:w-auto flex flex-col mt-4">
                <h1 className="w-full flex items-center justify-start font-poppins font-semibold text-primary text-2xl">
                  Settings
                </h1>
                <div className="w-full sm:w-auto flex flex-col gap-y-1 mt-4">
                  <h2 className="w-full flex items-center justify-start font-poppins font-semibold text-primary text-sm sm:text-base">
                    Two factor authentication
                  </h2>
                  <label
                    htmlFor="Toggle1"
                    className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800"
                  >
                    <span className="relative">
                      <input
                        id="Toggle1"
                        data-testid="toggle"
                        type="checkbox"
                        className="hidden peer"
                        checked={twoFactorEnabled}
                        onChange={handleToggleTwoFactorAuth}
                        role="testRole"
                      />
                      <div className="w-10 h-6 rounded-full shadow-inner bg-gray-600 peer-checked:bg-green-500"></div>
                      <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-gray-100"></div>
                    </span>
                    <span>
                      {loadingTwoFactor ? (
                        <BeatLoader color="#070F2B" />
                      ) : (profile as ProfileData).twoFactorEnabled ? (
                        'Enabled'
                      ) : (
                        'Disabled'
                      )}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAccount;
