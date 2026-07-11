import { useState, useCallback } from 'react';
import {
  uploadFile,
  uploadFileWithProgress,
  uploadBase64,
  getFileURL,
  deleteFile,
  getFileMetadata,
  updateFileMetadata,
  listFiles,
  generateFilePath,
  getFileExtension,
  isImage,
} from '../services/firebase/storage';

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, path, metadata = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const result = await uploadFile(file, path, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadWithProgress = useCallback((file, path, onProgress, metadata = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    const wrappedOnProgress = (data) => {
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
      if (onProgress) {
        onProgress(data);
      }
    };

    const result = uploadFileWithProgress(file, path, wrappedOnProgress, metadata);
    return result;
  }, []);

  const uploadBase64File = useCallback(async (base64String, path, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadBase64(base64String, path, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUrl = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFileURL(path);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFile = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteFile(path);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMetadata = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFileMetadata(path);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMetadata = useCallback(async (path, metadata) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateFileMetadata(path, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listFiles(path);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePath = useCallback((folder, fileName, userId = null) => {
    return generateFilePath(folder, fileName, userId);
  }, []);

  const getExtension = useCallback((fileName) => {
    return getFileExtension(fileName);
  }, []);

  const checkIsImage = useCallback((fileName) => {
    return isImage(fileName);
  }, []);

  return {
    loading,
    progress,
    error,
    upload,
    uploadWithProgress,
    uploadBase64File,
    getUrl,
    removeFile,
    getMetadata,
    updateMetadata,
    list,
    generatePath,
    getExtension,
    checkIsImage,
  };
};

export default useStorage;