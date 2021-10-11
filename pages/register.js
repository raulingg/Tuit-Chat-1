import { LockClosedIcon, UserIcon, AtSymbolIcon, ChatIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/assets/logo.svg';
import { useRef, useState } from 'react';

export default function SignUp() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [loginError, setLoginError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const resp = await fetch(`/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    if (resp.ok) setLoginError('Now you can log in :D');
    else setLoginError('Error');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-center">
            <Image src={logo} alt="logo" width={200} height={100} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or Already have a tuit Account?{' '}
            <Link href="/">
              <a className="font-medium text-purple-600 hover:text-purple-500">
                Sign In
              </a>
            </Link>
          </p>
        </div>
        <div className="bg-white max-w-md rounded overflow-hidden shadow-xl p-5">
          <form className="mt-5 space-y-6" onSubmit={handleSignUp}>
          {loginError}
          <div className="rounded-md shadow-sm -space-y-px">                             
              <div className="mt-1 relative rounded-md shadow-sm">
                <label htmlFor="name" className="sr-only">
                  Email address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                  <UserIcon
                    className="h-4 w-4 text-purple-450 items-center group-hover:text-purple-500"
                    aria-hidden="true"
                  />
                  </span>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  ref={nameRef}
                  required
                  className="focus:ring-indigo-500 mt-2 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Full name"
                />
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                  <AtSymbolIcon
                    className="h-4 w-4 text-purple-450 items-center group-hover:text-purple-500"
                    aria-hidden="true"
                  />
                  </span>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  ref={emailRef}
                  required
                  className="focus:ring-indigo-500 mt-2 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Email address"
                />
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                  <LockClosedIcon
                    className="h-4 w-4 text-purple-450 items-center group-hover:text-purple-500"
                    aria-hidden="true"
                  />
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  autoComplete="current-password"
                  required
                  className="focus:ring-indigo-500 mt-2 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Password"
                />
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <button
                type="button"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload a photo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree with the{' '}
                <Link href="https://github.com/Andy164/Tuit-Chat">
                  <a className="font-medium text-purple-600 hover:text-purple-500">
                  Terms of Service
                  </a>
                </Link>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ChatIcon
                  className="h-5 w-5 text-purple-450 group-hover:text-purple-500"
                  aria-hidden="true"
                />
              </span>
              Sign up
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
