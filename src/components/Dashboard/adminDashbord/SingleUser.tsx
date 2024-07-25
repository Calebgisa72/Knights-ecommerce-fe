import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { user } from './Users';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import formatDateAndTime from '../../../utils/formartDate&Time';
import { PropagateLoader } from 'react-spinners';
import ConfirmDeletePopup from '../../../components/Popups/ConfirmDeletePopup';
import { deactivateUser } from '../../../utils/updateUserStatus/deactivateUser';
import { activateUser } from '../../../utils/updateUserStatus/activateUser';

function SingleUser() {
  const initialState = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    phoneNumber: '',
    photoUrl: '',
    verified: undefined,
    twoFactorEnabled: undefined,
    status: undefined,
    role: undefined,
    createdAt: new Date()
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [currentUser, setCurrentUser] = useState<
    Partial<Omit<user, 'createdAt'>> & { createdAt: Date; email: string; firstName: string }
  >(initialState);
  const [loading, setLoading] = useState(true);
  const [relode, setRelode] = useState(false);
  const [upadatingLoading, setUpadatingLaoding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/single/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        if (response.status === 200) {
          const user: user = response.data.user;
          setCurrentUser(user);
        }
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch user');
      }
    };
    fetchData();
  }, [userToken, relode, id]);

  const createdAt = formatDateAndTime(currentUser.createdAt);

  return (
    <div className="p-7 w-full h-[calc(100vh-94px)]  bg-[#EEF5FF] overflow-y-scroll">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[20px] font-semibold">All Users</h1>
          <p className="text-[14px] font-light flex items-center">
            Home &gt;{' '}
            <span className="hover:underline cursor-pointer mx-1" onClick={() => navigate(`/Admin/dashboard/users`)}>
              Users
            </span>{' '}
            &gt;{' '}
            <span data-testid="userIdentifier">
              #{currentUser.firstName?.toLowerCase()}
              {currentUser.lastName?.toLowerCase()}
            </span>
          </p>
        </div>

        <div>
          <div className="w-full max-w-[1200px] p-7 bg-white">
            {loading ? (
              <div className="w-full flex justify-center px-6 py-20" data-testid="loading-spinner">
                <PropagateLoader color="#070f2b" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="w-full flex flex-col gap-4 xmd:flex-row xmd:gap-[20%] md:gap-[25%] justify-center">
                  <div className="flex flex-col gap-3 self-center xmd:self-start">
                    <p className="text-[16px] font-semibold">Profile Information</p>
                    <div
                      data-testid="profileIdentifier"
                      className="w-52 h-44 bg-neutral-100 rounded-lg flex justify-center object-contain"
                    >
                      {currentUser.photoUrl ? (
                        <img className="h-full w-full rounded-lg" src={currentUser.photoUrl} alt="User profile" />
                      ) : (
                        <p
                          className="self-center 
              "
                        >
                          No profile picture
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="text-[15px] font-medium self-center underline">Basic Info</p>
                    <div className="flex justify-between w-48 xmd:w-72 text-[14px] items-center">
                      <p>Status</p>
                      <div
                        data-testid="statusIdentifier"
                        className=" border-[1px] border-[#CCCBCB] px-2 py-1 rounded-lg"
                      >
                        {currentUser.status?.toLowerCase() === 'active' ? (
                          <div className="col-span-2 flex items-center gap-1 justify-start">
                            <div className="w-[10px] h-[10px] rounded-full bg-[#4D9A00]"></div>
                            <p>Active</p>
                          </div>
                        ) : (
                          <div className="col-span-2 flex items-center gap-1 justify-start">
                            <div className="w-[10px] h-[10px] rounded-full bg-[#FF3333]"></div>
                            <p>Suspended</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between w-48 xmd:w-72 text-[14px] items-center">
                      <p>Member since</p>
                      <p>{createdAt.date}</p>
                    </div>
                    <div className="flex justify-between w-48 xmd:w-72 text-[14px] items-center">
                      <p>Role</p>
                      <p>{currentUser.role}</p>
                    </div>

                    {currentUser.status?.toLowerCase() === 'active' ? (
                      <div>
                        <ConfirmDeletePopup
                          trigger={
                            <button
                              data-testid="deactivateStatusButton"
                              className="px-6 text-[15px] self-center mt-4 h-10 rounded-lg bg-[#FF3333] text-white"
                            >
                              {upadatingLoading ? <p>loading...</p> : <p>Deactivate</p>}
                            </button>
                          }
                          title={`Confirm Deactivating User`}
                          body={`Are you sure you want to deactivate user: ${currentUser.firstName + ' ' + currentUser.lastName}`}
                          onSubmit={() =>
                            deactivateUser(
                              userToken,
                              currentUser.email,
                              currentUser.firstName,
                              setRelode,
                              setUpadatingLaoding
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <ConfirmDeletePopup
                          trigger={
                            <button
                              data-testid="activateStatusButton"
                              className="px-6 text-[15px] self-center mt-4 h-10 rounded-lg bg-[#4D9A00] text-white"
                            >
                              {upadatingLoading ? <p>loading...</p> : <p>Activate</p>}
                            </button>
                          }
                          title={`Confirm Activating User`}
                          body={`Are you sure you want to activate user: ${currentUser.firstName + ' ' + currentUser.lastName}`}
                          onSubmit={() =>
                            activateUser(
                              userToken,
                              currentUser.email,
                              currentUser.firstName,
                              setRelode,
                              setUpadatingLaoding
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-[140px] gap-y-4 justify-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">First Name</p>
                    <div className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg">
                      <p className="text-[14px] font-normal">{currentUser.firstName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">Last Name</p>
                    <div className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg">
                      <p className="text-[14px] font-normal">{currentUser.lastName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">Email</p>
                    <div className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg">
                      <p className="text-[14px] font-normal">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">Contact No</p>
                    <div className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg">
                      <p className="text-[14px] font-normal">{currentUser.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">Gender</p>
                    <div className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg">
                      <p className="text-[14px] font-normal">{currentUser.gender}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-medium">Two factor authentication</p>
                    <div
                      data-testid="2FAIdentifier"
                      className="h-9 w-72 px-3 flex items-center bg-[#E7EBEF] border-[2px] border-[#CCCBCB] rounded-lg"
                    >
                      {currentUser.twoFactorEnabled ? (
                        <p className="text-[14px] font-normal">Enabled</p>
                      ) : (
                        <p className="text-[14px] font-normal">Disbled</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleUser;
