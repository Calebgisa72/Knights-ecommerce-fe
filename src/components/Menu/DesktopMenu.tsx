import React from 'react';
import { AppDispatch } from '../../redux/store';
import { clearCredentials } from '../../redux/reducers/authReducer';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchCart } from '../../redux/actions/cartAction';

function DesktopMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const logoutHandler = () => {
    dispatch(clearCredentials());
    dispatch(clearUser());
    navigate('/');
    dispatch(fetchCart());
  };

  return (
    <div className="bg-baseWhite border border-neutral-300 rounded-2 w-48 p-1 text-neutral-600">
      <ul className="flex flex-col ">
        <Link to={'/wishlist'}>
          <li className="hover:bg-neutral-300 pl-5 py-2 cursor-pointer">WishList</li>
        </Link>
        <li className="hover:bg-neutral-300 pl-5 py-2 cursor-pointer" onClick={() => navigate('/orders')}>
          My Orders
        </li>
        <li className="hover:bg-neutral-300 pl-5 py-2 cursor-pointer" onClick={() => navigate('/profile')}>
          Profile
        </li>
        <li onClick={logoutHandler} className="hover:bg-neutral-300 pl-5 py-2 cursor-pointer">
          Logout
        </li>
      </ul>
    </div>
  );
}

export default DesktopMenu;
