import React, { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, To } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Register from '../pages/Authentication/Register';
import RegisterVendor from '../pages/Authentication/RegisterVendor';
import VerifyEmail from '../pages/Authentication/VerifyEmail';
import Login, { DecodedToken } from '../pages/Authentication/Login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
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
import VendorOrder from '../pages/Orders/VendorOrder';
import SingleVendorOrder from '../pages/Orders/SingleVendorOrder';
import AdminOrders from '../pages/Orders/AdminOrders';
import SingleAdminOrder from '../pages/Orders/SingleAdminOrder';
import { JSX } from 'react/jsx-runtime';
import GoogleLogin from '../pages/Authentication/GoogleLogin';
import Transctions from '../pages/Transactions/Transctions';

const Router = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdmin = decodedToken?.role.toLowerCase() === 'admin';
  const isVendor = decodedToken?.role.toLowerCase() === 'vendor';
  const isBuyer = decodedToken?.role.toLowerCase() === 'buyer';

  useEffect(() => {
    if (userToken && location.pathname === '/wishlist') {
      dispatch(setOnWishlistPage(true));
    } else {
      dispatch(setOnWishlistPage(false));
    }
  }, [location.pathname, dispatch, userToken]);

  const conditionalNavigate = (adminPath: To, vendorPath: To, buyerPath: JSX.Element | To | any) => (
    <>
      {userToken && isAdmin && <Navigate to={adminPath} />}
      {userToken && isVendor && <Navigate to={vendorPath} />}
      {userToken && isBuyer && <Navigate to={buyerPath} />}
    </>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {!isAdmin && !isVendor ? (
              <MainLayout>
                <PageTitle title="Knights Store" />
                <Home />
              </MainLayout>
            ) : (
              conditionalNavigate('/admin/dashboard', '/vendor/dashboard', '/')
            )}
          </>
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
            {conditionalNavigate('/admin/dashboard', '/vendor/dashboard', '/')}
          </MainLayout>
        }
      />

      <Route
        path="/reset-password"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Reset Password" />
            <ResetPassword />
            {conditionalNavigate('/admin/dashboard', '/vendor/dashboard', '/')}
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Login" />
            {conditionalNavigate('/admin/dashboard/users', '/vendor/dashboard', '/')}
            {!userToken && <Login />}
          </MainLayout>
        }
      />

      <Route
        path="/login/google-auth"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Login" />
            {conditionalNavigate('/admin/dashboard', '/vendor/dashboard', '/')}
            {!userToken && <GoogleLogin />}
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
        path="/otp-verification"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Verify OTP" />
            <OtpPage />
            {conditionalNavigate('/admin/dashboard', '/vendor/dashboard', '/')}
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
        path="/profile"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Profile" />
            {userToken ? <DashboardAccount /> : <Navigate to="/" />}
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
            <PageTitle title="Knights Store | View Product" />
            <SingleProduct />
          </MainLayout>
        }
      />

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
        <Route path="orders" element={<Outlet />}>
          <Route path="" element={<VendorOrder />} />
          <Route path=":orderId" element={<SingleVendorOrder />} />
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

      <Route element={<ProtectedRoute requiredRole="buyer" />}>
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Create Order" />
              {userToken && isBuyer ? <CheckOutMain /> : <Navigate to="/login" />}
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
              <PageTitle title="Knights Store | Buyer  orders" />
              <BuyerOrders />
            </MainLayout>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <MainLayout>
              <PageTitle title="Knights Store | Orders" />
              {userToken && isBuyer ? (
                <SingleBuyerOrder />
              ) : (
                <Navigate to={`/${decodedToken?.role.toLowerCase()}` + '/dashboard'} />
              )}
              {!userToken && <Navigate to="/login" />}
            </MainLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<DashboarInnerLayout />}>
          <Route path="" element={<Users />} />
        </Route>
        <Route path="users" element={<DashboarInnerLayout />}>
          <Route path="" element={<Users />} />
          <Route path=":id" element={<SingleUser />} />
        </Route>
        <Route path="orders" element={<DashboarInnerLayout />}>
          <Route path="" element={<AdminOrders />} />
          <Route path=":orderId" element={<SingleAdminOrder />} />
        </Route>
        <Route path="account" element={<DashboarInnerLayout />}>
          <Route index element={<DashboardAccount />} />
        </Route>
        <Route path="transaction" element={<DashboarInnerLayout />}>
          <Route index element={<Transctions />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
