import React from 'react';
import iconXMark from '../../assets/iconoir_xmark-circle (2).svg';

function SuspendedAccount() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] bg-background3 text-baseBlack">
      <img src={iconXMark} alt="" className="w-16 xmd:w-20 pb-7" />
      <p className="text-center text-base sm:text-xl font-semibold leading-4">Your account has been suspended!</p>
      <p className=" text-[.8rem] sm:text-[.9rem] text-center leading-3 pt-2">
        Please contact our support team at{' '}
        <a href="mailto:knights@andela.com" className="italic underline text-orange">
          knights@andela.com
        </a>{' '}
        for more information.
      </p>
    </div>
  );
}

export default SuspendedAccount;
