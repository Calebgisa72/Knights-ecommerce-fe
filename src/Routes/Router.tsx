import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Register from '../pages/Authentication/Register';
import RegisterVendor from '../pages/Authentication/RegisterVendor';
import VerifyEmail from '../pages/Authentication/VerifyEmail';
import Login, { DecodedToken } from '../pages/Authentication/Login';
import { useSelector } from 'react-redux';
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
import DashboardEditProducts from '../components/Products/DashboardEditProducts/DashboardEditProducts';

const Router = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const isAdmin = decodedToken?.role.toLowerCase() === 'admin';
  const isVendor = decodedToken?.role.toLowerCase() === 'vendor';
  const isBuyer = decodedToken?.role.toLowerCase() === 'buyer';

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Register" />
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
            {userToken && isAdmin && <Navigate to="/admin/dashboard" />}
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
      <Route path="/vendor/dashboard" element={<DashboardLayout />}>
        <Route path="products" element={<DashboarInnerLayout />}>
          <Route path="" element={<DashboardProducts />} />
          <Route path="new" element={<DashboardNewProducts />} />
          <Route path=":id" element={<DashboardSingleProduct />} />
          <Route path=":id/edit" element={<DashboardEditProducts />} />
        </Route>
      </Route>

      <Route
        path="/search"
        element={
          <MainLayout>
            <PageTitle title="Knights Store | Search" />
            <SearchPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default Router;
