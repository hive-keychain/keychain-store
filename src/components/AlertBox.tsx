import {AlertDialog, Button, Center} from 'native-base';
import React from 'react';

interface Props {
  alertHeader: string;
  alertBodyMessage: string;
  buttonCancelTitle?: string;
  buttonProceedTitle?: string;
  onCancelHandler: () => void;
  onProceedHandler: () => void;
  show: boolean;
}

const AlertBox = ({
  alertHeader,
  alertBodyMessage,
  buttonCancelTitle,
  onCancelHandler,
  onProceedHandler,
  buttonProceedTitle,
  show,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(show);

  React.useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const onCancel = () => {
    onCancelHandler();
    setIsOpen(false);
  };

  const onProceed = () => {
    onProceedHandler();
    setIsOpen(false);
  };

  const cancelRef = React.useRef(null);

  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onCancel}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{alertHeader}</AlertDialog.Header>
          <AlertDialog.Body>{alertBodyMessage}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onCancel}
                ref={cancelRef}>
                {buttonCancelTitle ?? 'Cancel'}
              </Button>
              <Button colorScheme="danger" onPress={onProceed}>
                {buttonProceedTitle ?? 'Proceed'}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default AlertBox;
