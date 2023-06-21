import {
  Button,
  CheckIcon,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  Pressable,
  Select,
  VStack,
} from 'native-base';
import React from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {generateMemo} from '../utils/memo';

export default () => {
  const [formData, setData] = React.useState({});
  const [lock, setLock] = React.useState(false);
  const [currency, setCurrency] = React.useState('HBD');
  const [memo, setMemo] = React.useState('');

  return (
    <VStack width="90%" mx="3" maxW="300px" mt={60}>
      <Heading bold>New Invoice</Heading>
      <FormControl isRequired>
        <FormControl.Label
          _text={{
            bold: true,
          }}>
          Shop Username
        </FormControl.Label>
        <Input
          InputLeftElement={
            <Icon
              as={<Icon2 name="person" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          InputRightElement={
            <Pressable onPress={() => setLock(!lock)}>
              <Icon
                as={<Icon2 name={lock ? 'lock-outline' : 'lock-open'} />}
                size={5}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
          placeholder="myawesomeshop"
          isDisabled={lock}
          onChangeText={value => setData({...formData, name: value})}
        />
      </FormControl>
      <FormControl isRequired>
        <FormControl.Label
          _text={{
            bold: true,
          }}>
          Amount
        </FormControl.Label>
        <InputGroup>
          <Input
            keyboardType="number-pad"
            placeholder="1.000"
            isDisabled={lock}
            width="50%"
            onChangeText={value => setData({...formData, name: value})}
          />
          <Select
            //@ts-ignore
            isReadOnly
            selectedValue={currency}
            focusable={false}
            minWidth="50%"
            _selectedItem={{
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={itemValue => setCurrency(itemValue)}>
            <Select.Item label="HIVE" value="HIVE" />
            <Select.Item label="HBD" value="HBD" />
          </Select>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormControl.Label
          _text={{
            bold: true,
          }}>
          Memo
        </FormControl.Label>
        <Input
          InputLeftElement={
            <Icon
              as={<Icon2 name="note" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          InputRightElement={
            <Pressable onPress={() => setMemo(generateMemo())}>
              <Icon
                as={<Icon2 name="replay" />}
                size={5}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
          placeholder="myawesomeshop"
          value={memo}
          onChangeText={value => {
            setData({...formData, memo: value});
            setMemo(value);
          }}
        />
      </FormControl>
      <Button onPress={() => {}} mt="50" colorScheme="cyan">
        Submit
      </Button>
    </VStack>
  );
};
