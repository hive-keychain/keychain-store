import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, Button, Toast} from 'native-base';
import {ILinearGradientProps} from 'native-base/lib/typescript/components/primitives/Box/types';
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import React from 'react';
import AlertBox from '../components/AlertBox';
import ScreenLayout from '../components/ScreenLayout';
import {AsyncStorageKey} from '../utils/asyncstorage';

export default () => {
  const [showAlertBox, setShowAlertBox] = React.useState(false);

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
              `Error trying to delete.
                ${error.length ? error[0]?.message : ''}`,
              'bottom',
              'amber.400',
            );
          } else {
            showToast('All Data deleted from phone.', 'top', 'emerald.400');
          }
        },
      );
    } catch (error: any) {
      showToast(
        `Error ocurred deleting data. ${error.message}`,
        'bottom',
        'amber.400',
      );
    } finally {
      setShowAlertBox(false);
    }
  };

  return (
    <ScreenLayout>
      <Box
        p="2"
        w={'90%'}
        _text={{
          fontSize: 'md',
          fontWeight: 'medium',
          color: 'red.300',
          letterSpacing: 'lg',
        }}
        shadow={1}>
        Danger Zone
        <Button w={'150px'} onPress={() => setShowAlertBox(true)}>
          Delete All Data
        </Button>
        <AlertBox
          alertHeader="Proceed with caution"
          alertBodyMessage="Do you want to wipe all data from the app? This will erase all data definetely."
          buttonProceedTitle="Yes Delete"
          buttonCancelTitle="Cancel"
          onProceedHandler={handleDeleteAllData}
          show={showAlertBox}
          onCancelHandler={() => setShowAlertBox(false)}
        />
      </Box>
    </ScreenLayout>
  );
};
