import React from 'react';
import { Image, Swipeable, SwipeableItem } from '@deity/falcon-ui';

type Item = {
  thumb: string;
  url: string;
};

export const ProductGallery: React.SFC<{
  items: Item[];
}> = ({ items }) => {
  if (!items.length) return null;
  if (items.length === 1) {
    return <Image src={items[0].url} />;
  }

  return (
    <Swipeable>
      {items.map((item, index) => (
        <SwipeableItem key={`${index}`} as={Image} src={item.url} />
      ))}
    </Swipeable>
  );
};
