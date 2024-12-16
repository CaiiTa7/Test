"use client"

import { useState } from 'react';
import { Button } from "./button"
import { Input } from "./input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function JwtExample() {
  const [token, setToken] = useState('');
  const [protectedData, setProtectedData] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/docs/login', { method: 'POST' });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      setToken(data.token);
      setError('');
    } catch (err) {
      setError('Failed to login');
      console.error(err);
    }
  };

  const handleAccessProtected = async () => {
    try {
      const response = await fetch('/api/docs/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Access denied');
      const data = await response.json();
      setProtectedData(JSON.stringify(data));
      setError('');
    } catch (err) {
      setError('Failed to access protected route');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleLogin}>Login</Button>
      {token && (
        <>
          <div>Token: {token}</div>
          <Button onClick={handleAccessProtected}>Access Protected Route</Button>
        </>
      )}
      {protectedData && <div>Protected Data: {protectedData}</div>}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

