import { marked } from 'marked';
import * as Clipboard from 'expo-clipboard';
import markdownToTxt from 'markdown-to-txt';

export const RemoveMarkdown = (markdownContent : string) => {
    const plainText = markdownToTxt(markdownContent);
    return plainText
  };
  
 export const CopyToClipboard = async (text : string) => {
    await Clipboard.setStringAsync(text);
  };
