import { useState, useCallback } from 'react';
import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getAllDocuments,
  listenToDocument,
  listenToCollection,
  batchWrite,
  runTransactionOperation,
} from '../services/firebase/firestore';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (collectionName, data, id = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createDocument(collectionName, data, id);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (collectionName, id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDocument(collectionName, id);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (collectionName, id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateDocument(collectionName, id, data);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (collectionName, id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteDocument(collectionName, id);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const query = useCallback(async (collectionName, conditions, orderByField, orderDirection, limitCount) => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryDocuments(collectionName, conditions, orderByField, orderDirection, limitCount);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = useCallback(async (collectionName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllDocuments(collectionName);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const listen = useCallback((collectionName, id, callback) => {
    return listenToDocument(collectionName, id, callback);
  }, []);

  const listenQuery = useCallback((collectionName, conditions, orderByField, orderDirection, callback) => {
    return listenToCollection(collectionName, conditions, orderByField, orderDirection, callback);
  }, []);

  const batch = useCallback(async (operations) => {
    setLoading(true);
    setError(null);
    try {
      const result = await batchWrite(operations);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const transaction = useCallback(async (transactionFunction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await runTransactionOperation(transactionFunction);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    create,
    get,
    update,
    remove,
    query,
    getAll,
    listen,
    listenQuery,
    batch,
    transaction,
  };
};

export default useFirestore;