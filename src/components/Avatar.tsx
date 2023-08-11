import {Avatar} from 'native-base';
import React from 'react';

interface Props {
  username: string;
}

export default ({username}: Props) => {
  return (
    <Avatar
      size="48px"
      bg={'blue.100'}
      source={{
        uri: `https://images.hive.blog/u/${username}/avatar`,
      }}>
      {username}
    </Avatar>
  );
};
