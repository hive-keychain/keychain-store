import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ScrollView, View} from 'native-base';
import Footer from './Footer';

type Props = DrawerContentComponentProps;

export default (props: Props) => {
  return (
    <DrawerContentScrollView
      contentContainerStyle={{height: '100%', flex: 1}}
      {...props}>
      <ScrollView
        style={{flex: 1, height: '100%'}}
        contentContainerStyle={{
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View>
          <DrawerItemList {...props} />
        </View>
        <Footer {...props} />
      </ScrollView>
    </DrawerContentScrollView>
  );
};
