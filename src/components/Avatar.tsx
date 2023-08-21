import {Avatar} from 'native-base';
import {ThemeComponentSizeType} from 'native-base/lib/typescript/components/types';
import React from 'react';

interface Props {
  username: string;
  size?: ThemeComponentSizeType<'Avatar'>;
}

export default ({username, size}: Props) => {
  return (
    <Avatar
      size={size ?? '48px'}
      bg={'blue.100'}
      source={{
        uri: `https://images.hive.blog/u/${username}/avatar`,
      }}>
      {username}
    </Avatar>
  );
};
