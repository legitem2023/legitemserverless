'use client';
// pages/signin.tsx
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const mockAuth = (email: string, password: string): boolean => {
  // Mock authentication function
  return email === 'user@example.com' && password === 'password';
};

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mockAuth(email, password)) {
      alert('Sign in successful!');
      // Redirect or handle successful sign-in
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-lime-600 text-white font-semibold rounded-md shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
            <Link href='' className='text-blue-500 mt-2'>Forgot Password</Link>
            <div className="mb-6">
                    
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
