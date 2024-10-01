import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(auth)

  },[]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful', userCredential);
      setError('');
      navigate('/products');
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      setError('Error logging in: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful', userCredential);
      setError('');

      // Create a user document in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        email: userCredential.user.email,
        createdAt: new Date(),
      });

      navigate('/products');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('This email is already in use.');
        setError('This email is already in use.');
      } else {
        console.error('Error registering:', error.message);
        setError('Error registering: ' + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-center justify-center h-screen">
      <div className='font-bold text-xl'>WELCOME!</div>
      <input
        className="input border-2 rounded-lg p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input border-2 rounded-lg p-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-gray-400 py-2 px-4 rounded"
        type="button"
        onClick={handleLogin}
      >
        LOGIN
      </button>
      <button
        className="bg-gray-400 py-2 px-4 rounded"
        type="button"
        onClick={handleRegister}
      >
        REGISTER
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default Login;
