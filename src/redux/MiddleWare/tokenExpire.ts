import type { Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

export const tokenExpirationMiddleware: Middleware = store => next => action => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; 

      if (decoded.exp < currentTime) {
        toast.error('Token expired! Logging out...');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    } catch (err) {
      toast.error('Invalid token detected. Logging out...');
      console.log(store);
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
  }

  return next(action);
};
