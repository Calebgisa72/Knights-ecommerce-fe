import React from 'react';
import { NavLink } from 'react-router-dom';
import one from '/1.svg';
import two from '/3.svg';
import three from '/Component 3.svg';
import f from '/user-square.svg';
import dashboardIcon from '/Dashboard.svg';
import { CircleX } from 'lucide-react';
import userIcon from '../../../assets/Enquiry.svg';
import { useJwt } from 'react-jwt';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { AppDispatch } from '../../../redux/store';
import { clearCredentials } from '../../../redux/reducers/authReducer';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';

interface DashboardSideBarProps {
  openNav: boolean;
  setOpenNav: (open: boolean) => void;
}

const DashboardSideBar: React.FC<DashboardSideBarProps> = ({ openNav, setOpenNav }) => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const logoutHandler = () => {
    dispatch(clearCredentials());
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <div
      data-testid="sidebar"
      className={`fixed inset-y-0 left-0 z-20 bg-white transition-transform transform ${openNav ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:z-10 lg:flex flex-col gap-8 w-[260px] p-8 min-h-screen border-r-[1px] border-[#D1D1D1] text-black ease-in-out duration-300`}
    >
      <NavLink
        to={decodedToken?.role.toLowerCase() === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard'}
        className="text-3xl font-bold text-[#070f2b] ml-2"
      >
        Knights
      </NavLink>
      <button onClick={() => setOpenNav(false)} className="lg:hidden absolute right-4 top-6">
        <CircleX />
      </button>
      <div className="flex flex-col gap-4 text-[#7c7c7c] items-start w-full pt-8 lg:pt-0">
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
          }
        >
          <img src={dashboardIcon} alt="Dashboard" />
          Dashboard
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
          }
        >
          <img src={three} alt="Orders" /> Orders
        </NavLink>
        <NavLink
          to="products"
          className={({ isActive }) =>
            `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
          }
        >
          <img src={one} alt="Products" /> Products
        </NavLink>
        {decodedToken?.role.toLowerCase() === 'admin' && (
          <NavLink
            to="users"
            className={({ isActive }) =>
              `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
            }
          >
            <img src={userIcon} alt="Products" /> Users
          </NavLink>
        )}
      </div>
      <div className="mt-auto lg:pt-8 lg:border-t-2 text-[#7c7c7c] flex flex-col gap-4 border-[#7c7c7c] w-full pt-4 ">
        <NavLink
          to="account"
          className={({ isActive }) =>
            `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
          }
        >
          <img src={f} alt="Account" /> Account
        </NavLink>
        <NavLink
          onClick={logoutHandler}
          to={'/'}
          className={({ isActive }) =>
            `flex gap-4 p-2 w-full rounded transition-all duration-300 ease-in-out ${isActive ? 'bg-[#070f2b] text-white' : ''}`
          }
        >
          <img src={two} alt="Logout" /> Logout
        </NavLink>
      </div>
    </div>
  );
};

export default DashboardSideBar;
