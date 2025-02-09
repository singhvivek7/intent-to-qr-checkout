'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import PWAPage from '@/components/pwa';

const UPIPayment = () => {
  const params = useSearchParams();
  const intentStr = params.get('s');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [baseIntent, setBaseIntent] = useState(intentStr || '');

  // Generate UPI intent string
  const generateUPIIntent = () => {
    return baseIntent?.trim()?.toString();
  };

  // Handle direct UPI intent
  const handleDirectPayment = async () => {
    try {
      const intent = generateUPIIntent();
      window.location.href = intent;
    } catch (err) {
      console.log('🚀 ~ handleDirectPayment ~ err:', err);
      setError('Failed to open UPI app. Please try QR code payment.');
    }
  };

  // Generate and handle QR code payment
  const handleQRPayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus('processing');
      const intent = generateUPIIntent();

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(intent, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      setQrUrl(qrCodeUrl);

      // Create invisible image (for potential programmatic scanning)
      const img = document.createElement('img');
      img.src = qrCodeUrl;
      img.style.display = 'none';
      document.body.appendChild(img);

      setPaymentStatus('success');
    } catch (err) {
      console.log('🚀 ~ handleQRPayment ~ err:', err);
      setError('Failed to generate QR code');
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intentStr) {
      setBaseIntent(intentStr);
    }
  }, [intentStr]);

  return (
    <>
      <Card className="p-6 max-w-md mx-auto mt-5">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">UPI Payment</h2>
            <p className="text-sm text-gray-600">
              Amount: ₹{amount.toFixed(2)}
            </p>
          </div>
          <Input
            className="w-full"
            value={baseIntent}
            onChange={e => {
              const { value } = e.target;
              setBaseIntent(() => value);
              setQrUrl('');
              setError('');
              setPaymentStatus('idle');
              const url = new URL(value);
              const am = url.searchParams.get('am');
              if (am) setAmount(parseFloat(am));
            }}
            placeholder="Enter your UPI intent"
            type="text"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleDirectPayment();
              }
            }}
          />

          {qrUrl && (
            <div className="flex justify-center mb-4">
              <img src={qrUrl} alt="Payment QR Code" className="w-48 h-48" />
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleDirectPayment}
              className="w-full"
              disabled={loading || !baseIntent}>
              Pay Now
            </Button>

            <Button
              onClick={handleQRPayment}
              variant="outline"
              className="w-full"
              disabled={loading || !baseIntent}>
              Pay via QR Code
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 mt-2">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 mt-2">
              <CheckCircle size={16} />
              <span className="text-sm">Payment initiated successfully</span>
            </div>
          )}
        </div>
      </Card>
      <PWAPage />
    </>
  );
};

export default UPIPayment;
