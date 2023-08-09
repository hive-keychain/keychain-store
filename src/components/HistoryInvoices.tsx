import {Text, VStack} from 'native-base';
import ScreenLayout from './ScreenLayout';

export default () => {
  return (
    <ScreenLayout titleLayout="Invoices History">
      <VStack>
        <Text>History Screen</Text>
      </VStack>
    </ScreenLayout>
  );
};
