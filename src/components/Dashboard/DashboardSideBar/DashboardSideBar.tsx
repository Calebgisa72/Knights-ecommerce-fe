import React from 'react';
import { NavLink } from 'react-router-dom';
import one from '/1.svg';
import two from '/3.svg';
import three from '/Component 3.svg';
import f from '/user-square.svg';
import dashboardIcon from '/Dashboard.svg';
import { BadgeDollarSign, CircleX } from 'lucide-react';
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
      className={`fixed h-[100vh] inset-y-0 left-0 z-20 bg-white transition-transform transform ${openNav ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:z-10 flex flex-col gap-8 w-[280px] md:w-[220px] lg:w-[270px] p-4 min-h-screen border-r-[1px] border-neutral-300 text-black ease-in-out duration-300`}
    >
      <NavLink
        to={'/' + decodedToken?.role.toLowerCase() + '/dashboard'}
        className=" text-xl lg:text-2xl font-bold text-primary py-2"
      >
        Knights
      </NavLink>
      <button onClick={() => setOpenNav(false)} className="md:hidden absolute right-4 top-6">
        <CircleX />
      </button>
      <div className="flex flex-col gap-1 text-[#7c7c7c] items-start w-full pt-8 md:pt-3 text-[.75rem] xmd:text-[.82rem] lg:text-[.9rem]">
        <NavLink
          to={'/' + decodedToken?.role.toLowerCase() + '/dashboard'}
          end
          className={({ isActive }) =>
            `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
          }
        >
          <img src={dashboardIcon} alt="Dashboard" className="w-5 lg:w-6" />
          Dashboard
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
          }
        >
          <img src={three} alt="Orders" className="w-5 lg:w-6" /> Orders
        </NavLink>
        {decodedToken?.role.toLowerCase() !== 'admin' && (
          <NavLink
            to={'/' + decodedToken?.role.toLowerCase() + '/dashboard/products'}
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
            }
          >
            <img src={one} alt="Products" className="w-5 lg:w-6" /> Products
          </NavLink>
        )}
        {decodedToken?.role.toLowerCase() === 'admin' && (
          <NavLink
            to="users"
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
            }
          >
            <img src={userIcon} alt="Products" className="w-5 lg:w-6" /> Users
          </NavLink>
        )}
        {decodedToken?.role.toLowerCase() === 'admin' && (
          <NavLink
            to="transaction"
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
            }
          >
            <BadgeDollarSign />
            Transactions
          </NavLink>
        )}
      </div>
      <div className="mt-auto md:pt-4 text-[#7c7c7c] flex flex-col gap-1 w-full pt-4 md:border-t md:border-neutral-300 text-[.75rem] xmd:text-[.82rem] lg:text-[.9rem] ">
        <NavLink
          to="account"
          className={({ isActive }) =>
            `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
          }
        >
          <img src={f} alt="Account" className="w-5 lg:w-6" /> Account
        </NavLink>
        <NavLink
          onClick={logoutHandler}
          to={'/'}
          className={({ isActive }) =>
            `flex items-center gap-1 px-3 py-2 w-full rounded transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${isActive ? 'bg-primary text-white' : ''}`
          }
        >
          <img src={two} alt="Logout" className="w-5 lg:w-6" /> Logout
        </NavLink>
      </div>
    </div>
  );
};

export default DashboardSideBar;
