import React, { createContext, useCallback, useContext, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'info' | 'success' | 'error';
  description?: string;
  duration?: number;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastContextProvider: React.FC = ({ children }) => {
  const [toastMessages, updateToastMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ title, description, type, duration }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();

      const toastMessage = {
        id,
        title,
        description,
        type,
        duration,
      };

      updateToastMessages((currentMessages) => [
        ...currentMessages,
        toastMessage,
      ]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    updateToastMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={toastMessages} />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within an AuthToastProvider.');
  }

  return context;
};

export { ToastContextProvider, useToast };
