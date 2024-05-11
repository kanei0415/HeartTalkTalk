import React, { useCallback, useMemo, useState } from 'react';
import CCheck from '../CCheck';

type Props = {
  label: string;
  origin?: boolean;
  onCheckClickedOrigin: () => void;
};

const CCheckContainer = ({ label, origin, onCheckClickedOrigin }: Props) => {
  const [checked, setChecked] = useState(origin ?? false);

  const isCheckedImageShow = useMemo(() => {
    return origin ?? checked;
  }, [origin, checked]);

  const onCheckClicked = useCallback(() => {
    setChecked((prev) => !prev);
    onCheckClickedOrigin();
  }, [onCheckClickedOrigin]);

  return (
    <CCheck
      checked={isCheckedImageShow}
      label={label}
      onCheckClicked={onCheckClicked}
    />
  );
};

export default CCheckContainer;
