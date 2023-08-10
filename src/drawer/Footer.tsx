import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Text, VStack} from 'native-base';
type Props = DrawerContentComponentProps;

export default (props: Props) => {
  return (
    <VStack px={2} pb={5} space={2} alignItems={'center'}>
      <Text>Made with ❤ by Keychain Team</Text>
    </VStack>
  );
};
