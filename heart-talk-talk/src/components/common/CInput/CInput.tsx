import React from 'react';
import images from '@assets/images';

type Props = {
  type: 'email' | 'password' | 'name' | 'text';
  label: string;
  placeholder: string;
  onChange: (v: string) => void;
  error: {
    onError: boolean;
    errorMsg: string;
  };
  success: { onSuccess: boolean; successMsg: string };
  isNeededValue: boolean;
  focused: boolean;
  onFocused: () => void;
  onBlured: () => void;
  defaultValue?: string;
};

const CInput = ({
  type,
  label,
  placeholder,
  onChange,
  error,
  success,
  isNeededValue,
  focused,
  onFocused,
  onBlured,
  defaultValue,
}: Props) => {
  return (
    <div className='flex flex-col w-full'>
      <label className='flex flex-col w-full'>
        <span className='text-xs font-semibold'>
          {label}
          <span className='text-xs font-semibold text-red'>
            {isNeededValue ? '*' : ''}
          </span>
        </span>
        <div
          style={{ height: 48, marginTop: 6, paddingLeft: 16 }}
          className={`flex flex-row items-center ${
            focused ? 'border-2' : 'border'
          } ${
            error.onError
              ? 'border-red'
              : success.onSuccess
              ? 'border-green'
              : 'border-blue'
          } rounded`}>
          {type === 'email' && (
            <img src={images.common.cinput.email} alt='email input icon' />
          )}
          {type === 'password' && (
            <img
              src={images.common.cinput.password}
              alt='password input icon'
            />
          )}
          <input
            onFocus={onFocused}
            onBlur={onBlured}
            style={{ marginLeft: 4 }}
            placeholder={placeholder}
            className={`text-base text-black flex-1`}
            type={type}
            onChange={(e) => onChange(e.target.value)}
            defaultValue={defaultValue}
          />
        </div>
      </label>
      <span
        style={{ marginTop: 8, height: 14 }}
        className={`text-xs font-regular ${
          error.onError
            ? 'text-red'
            : success.onSuccess
            ? 'text-green'
            : 'text-blue'
        }`}>
        {error.errorMsg}
        {success.successMsg}
      </span>
    </div>
  );
};

export default CInput;
