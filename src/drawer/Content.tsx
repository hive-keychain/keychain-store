import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ScrollView, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import Footer from './Footer';

type Props = DrawerContentComponentProps;

export default (props: Props) => {
  return (
    <DrawerContentScrollView contentContainerStyle={style.container} {...props}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.containerSpaced}>
        <View>
          <DrawerItemList {...props} />
        </View>
        <Footer {...props} />
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  containerSpaced: {
    justifyContent: 'space-between',
    height: '100%',
  },
});
