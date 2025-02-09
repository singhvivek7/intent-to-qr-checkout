/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PWAPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any | null>(null);

  useEffect(() => {
    // Check online/offline status
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      try {
        await installPrompt?.prompt();
        const result = await installPrompt.userChoice;
        if (result.outcome === 'accepted') {
          console.log('App installed successfully');
        }
      } catch (error) {
        console.error('Error installing app', error);
      }
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-5">
      <CardHeader>
        <CardTitle>Install App to use offline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`p-4 rounded ${
            isOffline
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
          Connection Status: {isOffline ? 'Offline' : 'Online'}
        </div>

        {installPrompt && (
          <Button onClick={handleInstallApp} className="w-full">
            Install ItQR App
          </Button>
        )}

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Features:</h2>
          <ul className="list-disc list-inside">
            <li>Offline Support</li>
            <li>Install to Home Screen</li>
            <li>Background Sync</li>
            <li>Push Notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
