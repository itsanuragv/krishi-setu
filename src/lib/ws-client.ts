type WsHandler = (event: { type: string; payload: unknown }) => void;

/**
 * Mock-first realtime client. Swap the interval emitter for a real WebSocket
 * when NEXT_PUBLIC_API_MODE=live and the backend socket URL is available.
 */
export function subscribeToOrder(orderId: string, onEvent: WsHandler) {
  if (process.env.NEXT_PUBLIC_API_MODE !== "mock") {
    const url = process.env.NEXT_PUBLIC_WS_URL;
    if (!url) return () => undefined;
    const ws = new WebSocket(`${url}/orders/${orderId}`);
    ws.onmessage = (msg) => {
      try {
        onEvent(JSON.parse(msg.data));
      } catch {
        /* ignore malformed */
      }
    };
    return () => ws.close();
  }

  const statuses = ["accepted", "assigned", "picked_up", "in_transit", "delivered"];
  let i = 0;
  const timer = setInterval(() => {
    if (i >= statuses.length) {
      clearInterval(timer);
      return;
    }
    onEvent({ type: "order.status", payload: { orderId, status: statuses[i] } });
    i += 1;
  }, 4000);

  return () => clearInterval(timer);
}
