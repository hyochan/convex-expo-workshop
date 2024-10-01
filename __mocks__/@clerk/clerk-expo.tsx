import React from 'react';

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const ClerkLoaded: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useAuth = () => ({
  isSignedIn: true,
  userId: 'mock-user-id',
  getToken: jest.fn().mockResolvedValue('mock-jwt'),
});
