import {
  HStack,
  Heading,
  Image,
  PresenceTransition,
  Spinner,
  VStack,
} from 'native-base';
import React from 'react';

interface Props {
  accessibilityLabel?: string;
  colorHeader?: string;
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  headingTitle?: string;
  circularLogo?: boolean;
}

const Loader = ({
  accessibilityLabel,
  colorHeader,
  fontSize,
  headingTitle,
  circularLogo,
}: Props) => {
  return (
    <VStack space={2} justifyContent="center">
      {circularLogo && (
        <PresenceTransition
          visible
          animate={{
            rotate: '360deg',
            scale: 1,
            transition: {
              duration: 1000,
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
      )}
      <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel={accessibilityLabel ?? 'Loading posts'} />
        <Heading
          color={colorHeader ?? 'primary.500'}
          fontSize={fontSize ?? 'md'}>
          {headingTitle ?? 'Loading'}
        </Heading>
      </HStack>
    </VStack>
  );
};

export default Loader;
