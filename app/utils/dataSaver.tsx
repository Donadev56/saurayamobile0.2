import * as FileSystem from 'expo-file-system';
import { MessageInterface } from '../types/interface';
import { GetDate } from './date';
import { getUniqueID } from 'react-native-markdown-display';

export const SaveDataToLocalStorage = async (data: string, name: string) => {
  try {
    const fileUri = getfileUrl(name);
    await FileSystem.writeAsStringAsync(fileUri, data);
    const savedData = await GetDataFromLocalStorage(name);
    if (savedData) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const GetDataFromLocalStorage = async (name: string) => {
  try {
    const fileUri = getfileUrl(name);
    const data = await FileSystem.readAsStringAsync(fileUri);
    if (data) {
      return data;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getfileUrl = (name: string) => {
  return `${FileSystem.documentDirectory}${name}`;
};
