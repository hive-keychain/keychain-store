import {Image, PresenceTransition, VStack} from 'native-base';
import React from 'react';

const Loader = ({}) => {
  return (
    <VStack space={2} justifyContent="center">
      <PresenceTransition
        visible
        animate={{
          rotate: '360deg',
          scale: 1,
          transition: {
            duration: 2000,
          },
        }}>
        <Image
          source={require('../assets/keychain_logo_circular.png')}
          alt="hive keychain logo"
          resizeMode={'contain'}
          borderRadius={'sm'}
          height={'70px'}
          width={'70px'}
        />
      </PresenceTransition>
    </VStack>
  );
};

export default Loader;
