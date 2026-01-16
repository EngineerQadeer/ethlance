'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive } from 'lucide-react';
import { getStorageMethod } from '@/lib/storage-config';

export function StorageStatus() {
  const [storageMethod, setStorageMethod] = useState<'firebase' | 'localStorage'>('localStorage');

  useEffect(() => {
    setStorageMethod(getStorageMethod());
  }, []);

  if (storageMethod === 'localStorage') {
    return (
      <Badge variant="outline" className="text-xs">
        <HardDrive className="w-3 h-3 mr-1" />
        Local Storage
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="text-xs">
      <Database className="w-3 h-3 mr-1" />
      Firebase
    </Badge>
  );
}
