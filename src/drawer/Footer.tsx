import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Text, View, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, StyleSheet, TouchableOpacity} from 'react-native';

import DiscordLogo from '../assets/discord_logo.svg';
import HiveLogo from '../assets/hive_logo.svg';
import ThreadsLogo from '../assets/threads_logo.svg';
import {COLORS} from '../constants/colors';

type Props = DrawerContentComponentProps;

export default (_props: Props) => {
  const {t} = useTranslation();
  return (
    <VStack px={2} space={2} alignItems={'center'}>
      <Text>{t('footer:text')}</Text>
      <View style={styles.footerIconsContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL('https://peakd.com/@keychain')}
          style={styles.footerIconContainer}>
          <HiveLogo style={styles.footerLogo} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL('https://discord.gg/tUHtyev2xF')}
          style={styles.footerIconContainer}>
          <DiscordLogo style={styles.footerLogo} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL('https://twitter.com/HiveKeychain')}
          style={styles.footerIconContainer}>
          <ThreadsLogo width={20} style={styles.footerLogo} />
        </TouchableOpacity>
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  footerIconContainer: {
    borderWidth: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: COLORS.cardBorderColorContrast,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 45,
    height: 35,
    backgroundColor: '#FFF',
  },

  footerIconsContainer: {
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'space-evenly',
    marginTop: 32,
  },
  footerLogo: {
    bottom: 4,
  },
});
