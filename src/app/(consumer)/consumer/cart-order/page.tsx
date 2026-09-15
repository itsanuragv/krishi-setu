import { Suspense } from "react";
import { CartOrderForm } from "./cart-order-form";

export default function CartOrderPage() {
  return (
    <Suspense fallback={<p>Loading checkout…</p>}>
      <CartOrderForm />
    </Suspense>
  );
}
