import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Register from '../pages/Authentication/Register';
import RegisterVendor from '../pages/Authentication/RegisterVendor';
import VerifyEmail from '../pages/Authentication/VerifyEmail';
import Login, { DecodedToken } from '../pages/Authentication/Login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GoogleLoginSuccess from '../pages/Authentication/GoogleLoginSuccess';
import { useJwt } from 'react-jwt';
import OtpPage from '../pages/Authentication/OtpPage';
import SuspendedAccount from '../components/SuspendedAccount/SuspendedAccount';
import { ForgotPassword } from '../pages/Authentication/ForgotPassword';
import { ResetPassword } from '../pages/Authentication/ResetPassword';
import DashboardLayout from '../layout/DashboardLayout';
import DashboarInnerLayout from '../layout/DashboarInnerLayout';
import DashboardProducts from '../components/Products/DashboardProducts/DashboardProducts';
import DashboardSingleProduct from '../components/Products/DashboardSingleProduct/DashboardSingleProduct';
import DashboardNewProducts from '../components/Products/DashboardNewProducts/DashboardNewProducts';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/LandingPage/Home';
import SearchPage from '../pages/searchPage';
import SingleProduct from '../components/SingleProduct/SingleProduct';
import Cart from '../components/Cart/Cart';
import DashboardEditProducts from '../components/Products/DashboardEditProducts/DashboardEditProducts';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import { setOnWishlistPage } from '../redux/reducers/wishlistReducer';
import { useLocation } from 'react-router-dom';
import BuyerOrders from '../pages/Orders/BuyerOrders';
import SingleBuyerOrder from '../pages/Orders/SingleBuyerOrder';
import Users from '../components/Dashboard/adminDashbord/Users';
import SingleUser from '../components/Dashboard/adminDashbord/SingleUser';
import CheckOutMain from '../pages/Cart/checkOutMain';
import PaymentOk from '../pages/PaymentOk';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';
import DashboardAccount from '../components/Dashboard/DashboardAccount/DashboardAccount';

const Router = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const isAdmin = decodedToken?.role.toLowerCase() === 'admin';
  const isVendor = decodedToken?.role.toLowerCase() === 'vendor';
  const isBuyer = decodedToken?.role.toLowerCase() === 'buyer';

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userToken && location.pathname === '/wishlist') {
      dispatch(setOnWishlistPage(true));
    } else {
      dispatch(setOnWishlistPage(false));
    }
  }, [location.pathname, dispatch, userToken]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <PageTitle title="Knights Store" />
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/register"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Register" />
            <Register />
          </MainLayout>
        }
      />

      <Route
        path="/register-vendor"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Register Vendor" />
            <RegisterVendor />
          </MainLayout>
        }
      />

      <Route
        path="/verify-email/:token"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Verify Email" />
            <VerifyEmail />
          </MainLayout>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Forgot Password" />
            <ForgotPassword />
            {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
            {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
            {userToken && isBuyer && <Navigate to="/" />}
          </MainLayout>
        }
      />

      <Route
        path="/reset-password"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Reset Password" />
            <ResetPassword />
            {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
            {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
            {userToken && isBuyer && <Navigate to="/" />}
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Login" />
            {userToken && isAdmin && <Navigate to="/admin/dashboard/users" />}
            {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
            {userToken && isBuyer && <Navigate to="/" />}
            {!userToken && <Login />}
          </MainLayout>
        }
      />
      <Route
        path="/login/google-auth"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Login" />
            {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
            {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
            {userToken && isBuyer && <Navigate to="/" />}
            {!userToken && <GoogleLoginSuccess />}
          </MainLayout>
        }
      />
      <Route
        path="/suspended-account"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Suspended Account" />
            {userToken && <Navigate to="/" />}
            <SuspendedAccount />
          </MainLayout>
        }
      />
      <Route
        path="/otp-verficaton"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Verify OTP" />
            <OtpPage />
            {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
            {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
            {userToken && isBuyer && <Navigate to="/" />}
          </MainLayout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Wishlist" />
            {userToken ? <WishlistPage /> : <Navigate to="/" />}
          </MainLayout>
        }
      />

      <Route
        path="/search"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Search" />
            <SearchPage />
          </MainLayout>
        }
      />

      <Route
        path="/product/:id"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | View Product " />
            <SingleProduct />
          </MainLayout>
        }
      />
      {/*  Protected routes 1 . Vendor pages */}
      <Route
        path="/vendor/dashboard/*"
        element={
          <ProtectedRoute requiredRole="vendor">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardProducts />} />
        <Route path="account" element={<DashboarInnerLayout />}>
          <Route index element={<DashboardAccount />} />
        </Route>
        <Route path="products" element={<DashboarInnerLayout />}>
          <Route index element={<DashboardProducts />} />
          <Route path="new" element={<DashboardNewProducts />} />
          <Route path=":id" element={<DashboardSingleProduct />} />
          <Route path=":id/edit" element={<DashboardEditProducts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/cart"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Cart" />
            <Cart />
          </MainLayout>
        }
      />
      {/*  Protected routes 2 . Buyer pages */}

      <Route element={<ProtectedRoute requiredRole="buyer" />}>
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Create Order" />
              {userToken && isBuyer && <CheckOutMain />}
              {!userToken && <Navigate to="/login" />}
            </MainLayout>
          }
        />
        <Route
          path="/completion"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Payment successful" />
              <PaymentOk />
            </MainLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Orders" />
              {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
              {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
              {userToken && isBuyer && <BuyerOrders />}
              {!userToken && <Navigate to="/login" />}
            </MainLayout>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Orders" />
              {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
              {userToken && isVendor && <Navigate to="/vendor/dashboard" />}
              {userToken && isBuyer && <SingleBuyerOrder />}
              {!userToken && <Navigate to="/login" />}
            </MainLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/*  Protected routes 3 . Admin pages */}

      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/Admin/dashboard" element={<DashboardLayout />}>
          <Route path="users" element={<DashboarInnerLayout />}>
            <Route path="" element={<Users />} />
            <Route path=":id" element={<SingleUser />} />
            <Route path="account" element={<DashboardAccount />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
