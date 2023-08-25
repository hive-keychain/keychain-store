import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {HStack, Heading, Image, ScrollView, View} from 'native-base';
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
          <HStack px={2} alignItems={'center'}>
            <Image
              source={require('../assets/keychain_logo_circular.png')}
              alt="hive keychain logo"
              resizeMode="contain"
              height={30}
              width={30}
            />
            <Heading textAlign={'center'} margin={'10'}>
              Keychain Store
            </Heading>
          </HStack>
          <View>
            <DrawerItemList {...props} />
          </View>
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
