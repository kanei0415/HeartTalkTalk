import images from '@assets/images';
import React from 'react';

type Props = {
  checked: boolean;
  label: string;
  onCheckClicked: () => void;
};

const CCheck = ({ checked, label, onCheckClicked }: Props) => {
  return (
    <span
      onClick={onCheckClicked}
      className='flex flex-row items-center cursor-pointer'>
      <img
        src={images.common.ccheck[checked ? 'fill' : 'empty']}
        alt={checked ? 'checked' : 'empty'}
      />
      <div style={{ width: 8 }} />
      <span className='text-black'>{label}</span>
    </span>
  );
};

export default CCheck;
