import React from 'react';
import Image, { type StaticImageData } from 'next/image';

interface IProps {
  size?: number;
  src: StaticImageData;
}

export function TokenIcon(props: IProps) {
  const { size = 24, src } = props;

  return (
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <Image src={src} alt="icon" />
    </div>
  );
}
