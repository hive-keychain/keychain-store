import {HStack, Heading, Spinner} from 'native-base';
import React from 'react';

interface Props {
  accessibilityLabel?: string;
  colorHeader?: string;
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  headingTitle?: string;
}

const Loader = ({
  accessibilityLabel,
  colorHeader,
  fontSize,
  headingTitle,
}: Props) => {
  return (
    <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel={accessibilityLabel ?? 'Loading posts'} />
      <Heading color={colorHeader ?? 'primary.500'} fontSize={fontSize ?? 'md'}>
        {headingTitle ?? 'Loading'}
      </Heading>
    </HStack>
  );
};

export default Loader;
