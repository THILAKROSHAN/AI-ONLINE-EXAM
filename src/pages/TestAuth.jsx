import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase/config';

const TestAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResult(`✅ Login successful: ${userCredential.user.email}`);
      console.log('User:', userCredential.user);
    } catch (error) {
      setResult(`❌ Error: ${error.code} - ${error.message}`);
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResult(`✅ Registration successful: ${userCredential.user.email}`);
      console.log('User:', userCredential.user);
    } catch (error) {
      setResult(`❌ Error: ${error.code} - ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Firebase Auth</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="btn-primary"
            onClick={handleRegister}
          >
            Register
          </button>
          <button
            className="btn-primary"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          {result}
        </div>
      </div>
    </div>
  );
};

export default TestAuth;