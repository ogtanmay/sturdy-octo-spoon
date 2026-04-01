import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

// Directory inside the app's sandbox where user-created files live
export const APP_FILES_DIR = FileSystem.documentDirectory + 'files/';

/**
 * Ensure the app files directory exists.
 */
export const ensureAppFilesDir = async () => {
  const info = await FileSystem.getInfoAsync(APP_FILES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(APP_FILES_DIR, { intermediates: true });
  }
};

/**
 * Open the system file picker and return a file object ready for editing.
 * Returns null if the user cancels.
 */
export const pickFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const content = await FileSystem.readAsStringAsync(asset.uri);
  const name = asset.name;
  const ext = name.split('.').pop()?.toLowerCase() || '';

  return {
    id: asset.uri,
    name,
    uri: asset.uri,
    content,
    language: extToLanguage(ext),
    isRealFile: true,
    isDirty: false,
  };
};

/**
 * Read a file from a URI and return its string content.
 */
export const readFile = async (uri) => {
  return await FileSystem.readAsStringAsync(uri);
};

/**
 * Save content to the file at the given URI.
 * For files opened via the picker, we write to the cached copy.
 */
export const saveFile = async (uri, content) => {
  await FileSystem.writeAsStringAsync(uri, content);
};

/**
 * Create a new blank file in the app files directory.
 * Returns a file object ready for editing.
 */
export const createNewFile = async (name) => {
  await ensureAppFilesDir();
  const uri = APP_FILES_DIR + name;
  await FileSystem.writeAsStringAsync(uri, '');
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return {
    id: uri,
    name,
    uri,
    content: '',
    language: extToLanguage(ext),
    isRealFile: true,
    isDirty: false,
  };
};

/**
 * List all files stored in the app files directory.
 * Returns an array of file objects (no content loaded yet).
 */
export const listAppFiles = async () => {
  await ensureAppFilesDir();
  const names = await FileSystem.readDirectoryAsync(APP_FILES_DIR);
  return names.map((name) => {
    const uri = APP_FILES_DIR + name;
    const ext = name.split('.').pop()?.toLowerCase() || '';
    return {
      id: uri,
      name,
      uri,
      content: null,
      language: extToLanguage(ext),
      type: 'file',
      isRealFile: true,
    };
  });
};

/**
 * Map a file extension to a language identifier used by the syntax highlighter.
 */
export const extToLanguage = (ext) => {
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    txt: 'text',
    html: 'html',
    css: 'css',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    sh: 'shell',
    bash: 'shell',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
  };
  return map[ext] || 'text';
};
