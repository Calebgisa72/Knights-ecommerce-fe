import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import knightsLogo from '../../images/logo.png';
import cart from '../../images/cart.png';
import user from '../../images/user.png';
import notificationBell from '../../images/bell.png';
import menuIcon from '../../assets/Menu.svg';
import closeIcon from '../../assets/Close.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import DesktopMenu from '../Menu/DesktopMenu';
import Login from './loginComponent';
import CategoriesMenu from '../Menu/CategoriesMenu';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCart } from '../../redux/actions/cartAction';
import { setOpenNotification } from '../../redux/reducers/notification';
import NotificationLayout from '../Notification/NotificationLayout';

function Navbar() {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { openNotification, unreadNotifications } = useSelector((state: RootState) => state.notification);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setShowDesktopMenu(false);
  }, [userToken]);

  const desktopMenuHandler = () => {
    setShowDesktopMenu((prevData) => !prevData);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };
  const dispatch = useDispatch<AppDispatch>();

  const handleNotificationPopup = () => {
    dispatch(setOpenNotification(!openNotification));
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  //cart state
  const { cartItems } = useSelector((state: RootState) => state.cart);

  return (
    <nav
      className={`relative z-50 w-full min-h-[10vh] h-auto flex items-center ${userToken ? 'justify-center flex-col gap-4' : 'justify-between'} xmd:flex-row xmd:justify-between bg-white px-6 lg:px-12 py-5 sticky top-0 shadow-navbar text-baseBlack`}
      data-testid="navbar"
    >
      <h1
        data-testid="homePage"
        onClick={() => {
          navigate('/');
        }}
        className="cursor-pointer flex items-center justify-start gap-x-2 text-primary capitalize font-medium text-xl"
      >
        <img src={knightsLogo} alt="Knights Store Logo" />
        KNIGHTS STORE
      </h1>

      <NotificationLayout />

      {!userToken && (
        <div className="xmd:hidden flex gap-5" data-testid="userIcon">
          <Search strokeWidth={1.5} className="w-10 h-9 text-black" />
          <img
            onClick={() => setShowMenu((prevState) => !prevState)}
            src={menuIcon}
            className="w-9 h-9"
            alt="Menu Icon"
            data-testid="menuIcon"
          />
        </div>
      )}

      {userToken && (
        <div className="xmd:hidden flex justify-between w-[100%]" data-testid="userIcon">
          <Search strokeWidth={1.5} className="w-[25px] h-[25px] text-black" />
          <div onClick={handleNotificationPopup} className="relative cursor-pointer">
            <img src={notificationBell} className="w-[25px] h-[25px]" alt="Notification Bell" />
            {unreadNotifications > 0 && (
              <span className="absolute min-w-5 h-5 top-1 right-[14px] mt-[-10px] mr-[-15px] bg-orange text-white text-[.7rem] font-semibold flex items-center justify-center rounded-full leading-none p-1">
                {unreadNotifications}
              </span>
            )}
          </div>
          <a href="/cart" className="relative cursor-pointer">
            <img src={cart} alt="Cart Icon" className="w-[25px] h-[25px]" />
            <span className="absolute min-w-5 h5 top-1 right-[6px] mt-[-10px] mr-[-15px] bg-orange text-white text-xs flex items-center justify-center rounded-full leading-none p-1">
              {cartItems.length}
            </span>
          </a>
          <img
            src={user}
            onClick={desktopMenuHandler}
            alt="User Icon"
            className="w-[25px] h-[25px]"
            data-testid="userIcon"
          />
          <img
            onClick={() => setShowMenu((prevState) => !prevState)}
            src={menuIcon}
            className="w-[25px] h-[25px]"
            alt="Menu Icon"
            data-testid="menuIcon"
          />
        </div>
      )}

      {showMenu && (
        <div
          className={`absolute ${userToken ? 'top-32' : 'top-20'} left-0 w-[100%] bg-slate-100 h-[500px] p-6 flex flex-col gap-6`}
          data-testid="mobileMenu"
        >
          <div className={`flex ${userToken ? 'justify-end' : 'justify-between'}`}>
            {!userToken && (
              <div onClick={() => setShowMenu(false)}>
                <Link to="/login">
                  <Login data-testid="loginLink" />
                </Link>
              </div>
            )}
            <img onClick={() => setShowMenu(false)} src={closeIcon} alt="Close Icon" />
          </div>
          <div className="flex flex-col gap-3 items-center">
            <CategoriesMenu setShowMenu={setShowMenu} />
          </div>
        </div>
      )}

      <div className=" hidden lg:w-[40%] xmd:w-[40%] min-h-10 xmd:flex items-center justify-between gap-x-1 px-4 py-2 border border-neutrals500 bg-white rounded-3xl">
        <input
          className="w-full h-[100%] border-none outline-none bg-white text-grey2 text-base placeholder-grey2"
          type="text"
          id="searchInput"
          placeholder="search for anything"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchSubmit}
          data-testid="searchInput"
        />
        <Search onClick={handleSearch} strokeWidth={1.5} className="text-orange cursor-pointer" />
      </div>

      <div className="hidden xmd:flex items-center justify-end sm:gap-x-5 lg:gap-x-10">
        {!userToken && (
          <Link to="/login" data-testid="loginLink">
            <Login />
          </Link>
        )}
        {userToken && (
          <div onClick={handleNotificationPopup} className="relative cursor-pointer">
            <img src={notificationBell} alt="Notification Bell" className="w-7 h-7" />
            {unreadNotifications > 0 && (
              <span className="absolute min-w-5 h-5 top-1 right-[12px] mt-[-10px] mr-[-15px] bg-orange text-white text-sm flex items-center justify-center rounded-full leading-none p-1">
                {unreadNotifications}
              </span>
            )}
          </div>
        )}
        <a href="/cart" className="relative cursor-pointer" data-testid="cart">
          <img src={cart} alt="Cart Icon" className="w-7 h-7" />
          <span className="absolute min-w-5 h-5 top-1 right-[5px] mt-[-10px] mr-[-15px] bg-orange text-white text-sm flex items-center justify-center rounded-full leading-none p-1">
            {cartItems.length}
          </span>
        </a>
        {userToken && (
          <div onClick={desktopMenuHandler} className="relative cursor-pointer" data-testid="desktopMenuIcon">
            <img src={user} alt="User Icon" className="w-7 h-7" data-testid="userIcon" />
          </div>
        )}
      </div>
      {userToken && showDesktopMenu && (
        <div
          className="absolute top-[130px] right-[25%] xmd:right-6 xmd:top-[12vh]"
          onClick={() => setShowDesktopMenu(false)}
        >
          <DesktopMenu />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
