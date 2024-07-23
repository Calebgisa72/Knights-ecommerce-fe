import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import notificationIcon from '/notification.svg';
import searchIcon from '/search.svg';
import { AlignJustify } from 'lucide-react';
import { setOpenNotification } from '../../../redux/reducers/notification';
import NotificationLayout from '../../Notification/NotificationLayout';
import { AppDispatch, RootState } from '../../../redux/store';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { useJwt } from 'react-jwt';

interface DashboardNavBarProps {
  setOpenNav: (open: boolean) => void;
}

interface TokenPayload {
  email: string;
  name: string;
  userType: string;
  exp: number;
  firstName: string;
}

const DashboardNavbar: React.FC<DashboardNavBarProps> = ({ setOpenNav }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { openNotification, unreadNotifications } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch<AppDispatch>();

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNotificationPopup = () => {
    dispatch(setOpenNotification(!openNotification));
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Etc/GMT-2',
        timeZoneName: 'short'
      };
      const formattedDateTime = new Intl.DateTimeFormat('en-GB', options).format(now);
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const tokenString = localStorage.getItem('userToken');
    if (!tokenString) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<TokenPayload>(tokenString);
      //send name in token
      setUserName(decodedToken.firstName);
    } catch (error) {
      console.error('Failed to decode token:', error);
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div
      className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-1 md:gap-0 items-end px-4 lg:px-10 2xl:px-20 py-1 md:py-4 border-b-[1px] border-neutral-300 text-black"
      data-testid="navbar"
    >
      <div className="flex flex-col items-end md:items-start">
        <p className="font-semibold leading-5 capitalize text-sm lg:text-[.95rem]">Welcome, {userName}</p>
        <p className="text-[#7c7c7c] text-[.65rem] lg:text-[.8rem]">{currentDateTime}</p>
      </div>
      <NotificationLayout />
      <div className="flex min-w-full md:min-w-5 flex-col md:flex-row gap-4">
        <div className="flex justify-between">
          <NavLink
            to={'/' + decodedToken?.role.toLowerCase() + '/dashboard'}
            className="md:hidden text-2xl font-bold text-primary py-2"
          >
            Knights
          </NavLink>
          <div className="flex gap-4 items-center">
            <button onClick={handleNotificationPopup} className="relative px-5 py-1 md:border-r border-neutral-300">
              <img src={notificationIcon} alt="Notification" className="w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute min-w-5 min-h-4 top-1 right-[27px] mt-[-10px] mr-[-15px] bg-orange text-white text-[.7rem] font-semibold flex items-center justify-center rounded-full leading-none p-1">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button onClick={() => setOpenNav(true)} className="md:hidden" name="AlignJustify">
              <AlignJustify />
            </button>
          </div>
        </div>
        <div className="hidden md:flex px-4 py-1 rounded-md border border-[#d1d1d1] gap-2">
          <img src={searchIcon} alt="Search" className="w-4 lg:w-5" />
          <input
            type="text"
            className="bg-white text-[.8rem] lg:text-[.9rem] w-[140px] lg:w-[200px] outline-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
