// File Helpers
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

export const getFileNameWithoutExtension = (filename) => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
};

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  return imageExtensions.includes(getFileExtension(filename));
};

export const isVideoFile = (filename) => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  return videoExtensions.includes(getFileExtension(filename));
};

export const isAudioFile = (filename) => {
  const audioExtensions = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'];
  return audioExtensions.includes(getFileExtension(filename));
};

export const isDocumentFile = (filename) => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  return documentExtensions.includes(getFileExtension(filename));
};

export const isSpreadsheetFile = (filename) => {
  const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
  return spreadsheetExtensions.includes(getFileExtension(filename));
};

export const isPresentationFile = (filename) => {
  const presentationExtensions = ['ppt', 'pptx', 'odp'];
  return presentationExtensions.includes(getFileExtension(filename));
};

export const isArchiveFile = (filename) => {
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  return archiveExtensions.includes(getFileExtension(filename));
};

export const getFileType = (filename) => {
  if (isImageFile(filename)) return 'image';
  if (isVideoFile(filename)) return 'video';
  if (isAudioFile(filename)) return 'audio';
  if (isDocumentFile(filename)) return 'document';
  if (isSpreadsheetFile(filename)) return 'spreadsheet';
  if (isPresentationFile(filename)) return 'presentation';
  if (isArchiveFile(filename)) return 'archive';
  return 'other';
};

export const getFileIcon = (filename) => {
  const type = getFileType(filename);
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    spreadsheet: '📊',
    presentation: '📽️',
    archive: '📦',
    other: '📎',
  };
  return icons[type] || icons.other;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateUniqueFileName = (filename) => {
  const name = getFileNameWithoutExtension(filename);
  const extension = getFileExtension(filename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${name}_${timestamp}_${random}.${extension}`;
};

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

export const downloadFile = (content, filename, type = 'application/octet-stream') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadFileFromUrl = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const isFileValid = (file, allowedTypes, maxSize) => {
  if (!file) return { valid: false, error: 'No file provided' };
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  if (maxSize && file.size > maxSize) {
    return { valid: false, error: 'File size exceeds limit' };
  }
  return { valid: true };
};

export default {
  getFileExtension,
  getFileNameWithoutExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isDocumentFile,
  isSpreadsheetFile,
  isPresentationFile,
  isArchiveFile,
  getFileType,
  getFileIcon,
  formatFileSize,
  generateUniqueFileName,
  readFileAsText,
  readFileAsDataURL,
  readFileAsArrayBuffer,
  downloadFile,
  downloadFileFromUrl,
  isFileValid,
};