import React from 'react';
import logo from '../../images/logo.png';
import whataspp from '../../images/whatsapp.png';
import instagram from '../../images/instagram.png';
import gmail from '../../images/gmail.png';

function Footer() {
  return (
    <div className="w-full flex flex-col items-center justify-start gap-y-2 xmd:gap-y-8 py-8" data-testid="footer">
      <div className="w-full md:w-[80%] flex items-start justify-between gap-x-3 p-4 md:p-0">
        <div className="flex flex-col items-start justify-start gap-y-6 pb-10">
          <h1 className="flex items-end justify-start gap-x-1 xmd:gap-x-2 text-primary capitalize font-medium text-lg xmd:text-xl leading-4">
            <img src={logo} alt="" />
            KNIGHTS STORE
          </h1>

          <div className="flex items-start justify-start gap-x-6">
            <a
              href="https://wa.link/iij1xd"
              className="w-[27px] h-[27px] md:w-[40px] md:h-[40px] border border-grey3 p-1"
            >
              <img src={whataspp} alt="" className="w-full h-full" />
            </a>

            <a
              href="https://www.instagram.com/"
              className="w-[27px] h-[27px] md:w-[40px] md:h-[40px] border border-grey3 p-1"
            >
              <img src={instagram} alt="" className="w-full h-full" />
            </a>

            <a
              href="mailto:knights@andela.com"
              className="w-[27px] h-[27px] md:w-[40px] md:h-[40px] border border-grey3 p-1"
            >
              <img src={gmail} alt="" className="w-full h-full" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-y-2 pb-10">
          <h2 className="flex items-center justify-start gap-x-2 text-primary font-medium text-base md:text-lg">
            Address / Office
          </h2>
          <div className="flex flex-col gap-y-1 text-xs text-grey2">
            <p>Kigali-Rwanda</p>
            <p>Gasabo, Kimironko</p>
            <p>Tel No: +250780288777</p>
            <p>Email: knights@andela.com</p>
          </div>
        </div>
      </div>
      <hr className="w-[95%] xmd:w-[80%] h-[2px] bg-grey3" />
      <div className="w-full flex items-center justify-center">
        <p className="text-primary text-sm md:text-base">
          © {new Date().getFullYear()} Knights Store. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
