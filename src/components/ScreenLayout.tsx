import {Box, Text} from 'native-base';

interface Props {
  titleLayout?: string;
  children: JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export default ({titleLayout, children}: Props) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      {titleLayout && <Text>{titleLayout}</Text>}
      {children}
    </Box>
  );
};
