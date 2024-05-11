import React, { useCallback, useMemo, useState } from 'react';
import CInput from '../CInput';
import {
  EMAIL_INPUT_REGEX,
  NAME_INPUT_REGEX,
  PASSWORD_INUPT_REGEX,
} from '@libs/regex';

type Props = {
  type: 'email' | 'password' | 'name' | 'text';
  label: string;
  placeholder: string;
  onChange: (v: string) => void;
  error: {
    onError: boolean;
    errorMsg: string;
  } | null;
  success: {
    onSuccess: boolean;
    successMsg: string;
  } | null;
  isNeededValue: boolean;
  defaultValue?: string;
};

const CInputContainer = ({
  type,
  label,
  placeholder,
  onChange,
  error,
  success,
  isNeededValue,
  defaultValue,
}: Props) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const errorInfo = useMemo(() => {
    if (error?.onError) {
      return error;
    }

    if (value === '') {
      return {
        onError: false,
        errorMsg: '',
      };
    }

    if (type === 'email') {
      if (!EMAIL_INPUT_REGEX.test(value)) {
        return {
          onError: true,
          errorMsg: '이메일 형식을 확인해주세요',
        };
      }
    }

    if (type === 'password') {
      if (!PASSWORD_INUPT_REGEX.test(value)) {
        return {
          onError: true,
          errorMsg: '비밀번호는 8~15 자리 입니다.',
        };
      }
    }

    if (type === 'name') {
      if (!NAME_INPUT_REGEX.test(value)) {
        return {
          onError: true,
          errorMsg: '이름 형식에 맞지 않습니다.',
        };
      }
    }

    return {
      onError: false,
      errorMsg: '',
    };
  }, [value, type, error]);

  const successInfo = useMemo(() => {
    if (!errorInfo.onError) {
      if (success?.onSuccess) {
        return success;
      }

      if (type === 'email' && EMAIL_INPUT_REGEX.test(value)) {
        return {
          onSuccess: true,
          successMsg: '올바른 이메일 입력입니다',
        };
      }

      if (type === 'password' && PASSWORD_INUPT_REGEX.test(value)) {
        return {
          onSuccess: true,
          successMsg: '올바른 비밀번호 입력입니다',
        };
      }

      if (type === 'name' && NAME_INPUT_REGEX.test(value)) {
        return {
          onSuccess: true,
          successMsg: '올바른 이름 입력입니다',
        };
      }
    }

    return {
      onSuccess: false,
      successMsg: '',
    };
  }, [value, type, errorInfo, success]);

  const onFocused = useCallback(() => setFocused(true), []);
  const onBlured = useCallback(() => setFocused(false), []);

  const onInputChanged = useCallback(
    (v: string) => {
      setValue(v);
      onChange(v);
    },
    [onChange],
  );

  return (
    <CInput
      type={type}
      label={label}
      placeholder={placeholder}
      onChange={onInputChanged}
      error={errorInfo}
      success={successInfo}
      isNeededValue={isNeededValue}
      focused={focused}
      onFocused={onFocused}
      onBlured={onBlured}
      defaultValue={defaultValue}
    />
  );
};

export default CInputContainer;
