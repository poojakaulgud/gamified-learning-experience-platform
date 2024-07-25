'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

export const AuthContextProvider = ({ children }: React.PropsWithChildren) => (
  <AuthProvider>{children}</AuthProvider>
);
