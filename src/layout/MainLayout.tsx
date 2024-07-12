import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Chatbot from '../components/Chatbot/Chatbot';

const MainLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
        <Chatbot />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
