import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import notificationIcon from '/notification.svg';
import searchIcon from '/search.svg';
import { Link } from 'react-router-dom';
import { AlignJustify } from 'lucide-react';

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      className="flex justify-end gap-4 lg:gap-0 flex-col-reverse items-end lg:flex-row lg:justify-between lg:items-center p-7 py-5 border-b-[1px] border-[#D1D1D1] text-black relative"
      data-testid="navbar"
    >
      <Link to={'/vendor/dashboard'} className="lg:hidden text-4xl font-bold text-[#070f2b] absolute left-8 top-8">
        Knight
      </Link>
      <div className="flex flex-col items-end lg:items-start">
        <p className="font-bold text-[20px]">Welcome, {userName}</p>
        <p className="text-[#7c7c7c] text-sm">{currentDateTime}</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-4 items-center">
          <button className="px-4 lg:border-r-2 border-[#7c7c7c]">
            <img src={notificationIcon} alt="Notification" />
          </button>
          <button onClick={() => setOpenNav(true)} className="lg:hidden" name="AlignJustify">
            <AlignJustify />
          </button>
        </div>
        <div className="hidden lg:flex px-4 py-2 rounded-lg border border-[#d1d1d1] gap-2">
          <img src={searchIcon} alt="Search" />
          <input
            type="text"
            className="bg-white w-[200px] outline-none"
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
