import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Socket } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { getSocket, disconnectSocket } from '../services/socket';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    if (token && user) {
      setConnecting(true);
      const s = getSocket(token);

      const onConnect = () => {
        setConnected(true);
        setConnecting(false);
      };

      const onDisconnect = () => {
        setConnected(false);
        setConnecting(false);
      };

      const onConnectError = (err: Error) => {
        console.error('Socket connection error:', err.message);
        setConnected(false);
        setConnecting(false);
      };

      s.on('connect', onConnect);
      s.on('disconnect', onDisconnect);
      s.on('connect_error', onConnectError);

      if (!s.connected) {
        s.connect();
      } else {
        setConnected(true);
        setConnecting(false);
      }

      setSocket(s);

      return () => {
        s.off('connect', onConnect);
        s.off('disconnect', onDisconnect);
        s.off('connect_error', onConnectError);
      };
    } else {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      setConnecting(false);
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, connected, connecting }}>
      {children}
    </SocketContext.Provider>
  );
};
