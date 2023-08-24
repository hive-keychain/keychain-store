import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, Button, Select, Text, Toast} from 'native-base';
import {ILinearGradientProps} from 'native-base/lib/typescript/components/primitives/Box/types';
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import AlertBox from '../components/AlertBox';
import ScreenLayout from '../components/ScreenLayout';
import {LANGUAGELIST} from '../constants/localization';
import {AsyncStorageKey} from '../utils/asyncstorage';

export default () => {
  const {t, i18n} = useTranslation();
  const [showAlertBox, setShowAlertBox] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);

  const showToast = (
    message: string,
    placement:
      | 'top'
      | 'bottom'
      | 'top-right'
      | 'top-left'
      | 'bottom-left'
      | 'bottom-right'
      | undefined,
    bg: ResponsiveValue<ColorType | ILinearGradientProps>,
  ) =>
    Toast.show({
      render: () => {
        return (
          <Box bg={bg} px="2" py="1" rounded="sm" mb={5}>
            {message}
          </Box>
        );
      },
      duration: 5000,
      placement: placement,
    });

  const handleDeleteAllData = () => {
    try {
      AsyncStorage.multiRemove(
        [AsyncStorageKey.INVOICE_HISTORY_LIST, AsyncStorageKey.LAST_STORE_NAME],
        error => {
          console.log({errorDeletion: error});
          if (error) {
            showToast(
              `${t('error:error_on_delete_invoice')}
                ${error.length ? error[0]?.message : ''}`,
              'bottom',
              'amber.400',
            );
          } else {
            showToast(t('common:data_deleted'), 'top', 'emerald.400');
          }
        },
      );
    } catch (error: any) {
      showToast(
        `${t('error:error_on_delete_data')} ${error.message}`,
        'bottom',
        'amber.400',
      );
    } finally {
      setShowAlertBox(false);
    }
  };

  const handleSelectLanguage = async (langCode: string) => {
    try {
      setSelectedLanguage(langCode);
      i18n.changeLanguage(langCode);
      await AsyncStorage.setItem(
        AsyncStorageKey.LANGUAGE_SELECTED,
        langCode,
        error => {
          if (error) {
            console.log({ErrorStoringInPhone: error.message});
          }
        },
      );
    } catch (error: any) {
      console.log({ErrorSettingLanguage: error.message});
    }
  };

  return (
    <ScreenLayout>
      <Box p="2" w={'90%'} shadow={1}>
        <Text fontSize={'md'}>{t('common:language_settings')}</Text>
        <Select
          //@ts-ignore
          isReadOnly
          selectedValue={selectedLanguage}
          focusable={false}
          minWidth="50%"
          onValueChange={itemValue => handleSelectLanguage(itemValue)}
          fontSize={'sm'}>
          {LANGUAGELIST.map(lang => {
            console.log({lang}); //TODO remove line
            return (
              <Select.Item
                key={lang.code}
                label={lang.label}
                value={lang.code}
              />
            );
          })}
        </Select>
      </Box>
      <Box p="2" w={'90%'} shadow={1}>
        <Text fontSize={'md'} color={'red.300'}>
          {t('common:danger_zone')}
        </Text>
        <Button w={'150px'} onPress={() => setShowAlertBox(true)}>
          {t('common:delete_all_data')}
        </Button>
        <AlertBox
          alertHeader={t('common:alert_box_header_caution')}
          alertBodyMessage={t('common:alert_box_body_deletion')}
          buttonProceedTitle={t('common:confirm_delete')}
          buttonCancelTitle={t('common:cancel')}
          onProceedHandler={handleDeleteAllData}
          show={showAlertBox}
          onCancelHandler={() => setShowAlertBox(false)}
        />
      </Box>
    </ScreenLayout>
  );
};
