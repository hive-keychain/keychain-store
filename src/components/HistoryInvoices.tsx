import {DrawerScreenProps} from '@react-navigation/drawer';
import {Text, VStack} from 'native-base';
import {MainDrawerParamList} from '../types/navigation.types';
import ScreenLayout from './ScreenLayout';

type Props = DrawerScreenProps<MainDrawerParamList, 'History'>;

export default ({navigation, route}: Props) => {
  console.log({navigation, route});
  return (
    <ScreenLayout titleLayout="Invoices History">
      <VStack>
        <Text>History Screen</Text>
      </VStack>
    </ScreenLayout>
  );
};
