import React from 'react';
import CButton from '../CButton';

type Props = {
  onClicked: () => void;
  label: string;
  imgSrc?: string;
  activate: boolean;
};

const CButtonContainer = (props: Props) => {
  return <CButton {...props} />;
};

export default CButtonContainer;
