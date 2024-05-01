import React from 'react';

type Props = {
  onClicked: () => void;
  label: string;
  activate: boolean;
  imgSrc?: string;
};

const CButton = ({ onClicked, label, activate, imgSrc }: Props) => {
  return (
    <button
      style={{ height: 48 }}
      onClick={activate ? onClicked : undefined}
      className={`rounded ${activate ? 'bg-blue' : 'bg-gray'} ${
        activate ? 'cursor-pointer' : 'cursor-not-allowed'
      } flex flex-row items-center p-4 w-full items-center justify-center`}>
      <span
        className={`${
          activate ? 'text-white' : 'text-black'
        } text-base font-regular`}>
        {label}
      </span>
      {imgSrc && <img style={{ marginLeft: 8 }} src={imgSrc} alt='button to' />}
    </button>
  );
};

export default CButton;
