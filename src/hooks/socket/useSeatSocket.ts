import { Client, type IMessage, StompConfig } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

// Simple STOMP over SockJS wrapper for seat updates.
// Assumptions:
// - Backend exposes a STOMP endpoint at `${VITE_WS_URL}` (default to /ws)
// - Clients can SUBSCRIBE to topic: /topic/seats/{tripId}/{carId}
// - Clients can SEND to application endpoint: /app/seat/hold and /app/seat/release

const WS_URL =
  (import.meta.env.VITE_WS_URL as string) ||
  `${location.protocol}//${location.hostname}:5181/ws`;

export type SeatUpdatePayload = {
  tripId: string;
  carId: string;
  seatIds: string[];
  action: "hold" | "release";
  holdUntil?: string;
  by?: string;
};

export const useSeatSocket = () => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    } as StompConfig);

    client.onConnect = (frame) => {
      console.info("WebSocket connected:", frame);
      setIsConnected(true);
    };

    client.onDisconnect = (frame) => {
      console.error("WebSocket disconnected:", frame);
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("WebSocket STOMP error:", frame);
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      try {
        client.deactivate();
      } catch (e) {
        // ignore
      }
      clientRef.current = null;
      setIsConnected(false);
    };
  }, []);

  const subscribe = (
    tripId: string,
    carId: string,
    handler: (payload: SeatUpdatePayload) => void
  ) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn("WebSocket not connected, cannot subscribe");
      return () => {};
    }
    const topic = `/topic/seats/${tripId}/${carId}`;
    const sub = clientRef.current.subscribe(topic, (msg: IMessage) => {
      try {
        const body = JSON.parse(msg.body) as SeatUpdatePayload;
        handler(body);
      } catch (e) {
        console.error("Error parsing seat update message:", e);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  };

  const sendHold = (
    tripId: string,
    carId: string,
    seatIds: string[],
    minutes: number = 5
  ) => {
    if (!clientRef.current) {
      console.warn("WebSocket not connected, cannot send hold message");
      return;
    }
    const dest = "/app/seat/hold";
    const payload: SeatUpdatePayload = {
      tripId,
      carId,
      seatIds,
      action: "hold",
      holdUntil: new Date(Date.now() + minutes * 60 * 1000).toISOString(),
    };

    clientRef.current.publish({
      destination: dest,
      body: JSON.stringify(payload),
    });
  };

  const sendRelease = (tripId: string, carId: string, seatIds: string[]) => {
    if (!clientRef.current) {
      console.warn("WebSocket not connected, cannot send release message");
      return;
    }
    const dest = "/app/seat/release";
    const payload: SeatUpdatePayload = {
      tripId,
      carId,
      seatIds,
      action: "release",
    };

    clientRef.current.publish({
      destination: dest,
      body: JSON.stringify(payload),
    });
  };

  const getConnectionStatus = () => {
    return clientRef.current?.connected ?? false;
  };

  return {
    subscribe,
    sendHold,
    sendRelease,
    isConnected,
    getConnectionStatus,
  };
};

export default useSeatSocket;
