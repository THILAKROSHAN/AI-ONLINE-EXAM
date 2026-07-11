// Firebase Storage Service
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  uploadString,
} from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (file, path, metadata = {}) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = await uploadBytes(storageRef, file, {
      ...metadata,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        ...metadata.customMetadata,
      },
    });
    
    const downloadURL = await getDownloadURL(storageRef);
    return {
      success: true,
      url: downloadURL,
      path: path,
      metadata: uploadTask.metadata,
    };
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

export const uploadFileWithProgress = (file, path, onProgress, metadata = {}) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      ...metadata,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        ...metadata.customMetadata,
      },
    });
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress({
            progress: Math.round(progress),
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state,
          });
        }
      },
      (error) => {
        console.error('❌ Upload error:', error);
        if (onProgress) onProgress({ error: error.message });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(storageRef);
          if (onProgress) {
            onProgress({ success: true, url: downloadURL, path: path });
          }
        } catch (error) {
          console.error('❌ Error getting download URL:', error);
          if (onProgress) onProgress({ error: error.message });
        }
      }
    );
    
    return { success: true, uploadTask };
  } catch (error) {
    console.error('❌ Error starting upload:', error);
    return { success: false, error: error.message };
  }
};

export const uploadBase64 = async (base64String, path, metadata = {}) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = await uploadString(storageRef, base64String, 'data_url', {
      ...metadata,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        ...metadata.customMetadata,
      },
    });
    
    const downloadURL = await getDownloadURL(storageRef);
    return {
      success: true,
      url: downloadURL,
      path: path,
      metadata: uploadTask.metadata,
    };
  } catch (error) {
    console.error('❌ Error uploading base64:', error);
    return { success: false, error: error.message };
  }
};

export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) {
    console.error('❌ Error getting file URL:', error);
    return { success: false, error: error.message };
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

export const getFileMetadata = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return { success: true, metadata };
  } catch (error) {
    console.error('❌ Error getting file metadata:', error);
    return { success: false, error: error.message };
  }
};

export const updateFileMetadata = async (path, metadata) => {
  try {
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, metadata);
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating file metadata:', error);
    return { success: false, error: error.message };
  }
};

export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = result.items.map((item) => ({
      name: item.name,
      path: item.fullPath,
      fullPath: item.fullPath,
    }));
    
    const folders = result.prefixes.map((prefix) => ({
      name: prefix.name,
      path: prefix.fullPath,
      fullPath: prefix.fullPath,
    }));
    
    return { success: true, files, folders };
  } catch (error) {
    console.error('❌ Error listing files:', error);
    return { success: false, error: error.message };
  }
};

export const generateFilePath = (folder, fileName, userId = null) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = userId 
    ? `${folder}/${userId}/${timestamp}_${random}_${sanitizedFileName}`
    : `${folder}/${timestamp}_${random}_${sanitizedFileName}`;
  return path;
};

export const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

export const isImage = (fileName) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  return imageTypes.includes(getFileExtension(fileName));
};

export { storage };