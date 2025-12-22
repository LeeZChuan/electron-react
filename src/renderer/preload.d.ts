import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler & {
      config: {
        read: () => Promise<{ success: boolean; data?: any; error?: string; details?: string }>;
        write: (configData: any) => Promise<{ success: boolean; error?: string; details?: string }>;
      };
    };
  }
}

export {};
