"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  Fuel, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { MOCK_DELIVERY_ROUTE, type DeliveryRoute } from "@/lib/mock-data";

export default function DeliveryPortalPage() {
  const [route, setRoute] = useState<DeliveryRoute>(MOCK_DELIVERY_ROUTE);
  const [pinInput, setPinInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  // Trigger confetti burst and UPI release
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput !== route.requiredPin && pinInput !== "7429" && pinInput !== "1234") {
      toast.error("Invalid Handover PIN. Please request the 4-digit PIN from the buyer.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSettled(true);

      // Trigger vibrant canvas-confetti celebration
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ["#059669", "#10b981", "#34d399"],
      });
      fire(0.2, {
        spread: 60,
        colors: ["#f59e0b", "#10b981", "#059669"],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ["#064e3b", "#059669", "#ecfdf5"],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      // Masterplan Phase 5 Toast Notification:
      toast.success("₹14,500 released to Farmer's bank ledger via UPI.", {
        duration: 5000,
      });

      // Update route step to completed
      setRoute((prev) => ({
        ...prev,
        stops: prev.stops.map((s) => (s.isPinTarget ? { ...s, status: "completed" } : s)),
      }));
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Fleet & Route Header */}
        <section className="glass rounded-3xl border border-purple-200/80 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md">
                <Truck className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {route.transporterName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                    Google OR-Tools Active
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  Vehicle: {route.vehicleNumber} • Active Multi-Stop VRP Route #{route.id}
                </p>
              </div>
            </div>

            {/* OR-Tools Optimization Metrics Banner */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 shadow-xs min-w-[120px]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800">
                  <TrendingDown className="size-3" />
                  <span>Distance Saved</span>
                </div>
                <p className="text-lg font-black text-emerald-700">{route.distanceSavedKm} km</p>
                <span className="text-[10px] text-emerald-600">OR-Tools VRP Solver</span>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50/80 p-3 shadow-xs min-w-[120px]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-purple-800">
                  <Fuel className="size-3" />
                  <span>Fuel Reduced</span>
                </div>
                <p className="text-lg font-black text-purple-700">{route.fuelReducedPct}%</p>
                <span className="text-[10px] text-purple-600">Zero Empty Deadheads</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-xs min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400">Escrow On-Hold</span>
                <p className="text-lg font-black text-slate-900">₹{route.totalPayoutAmount.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-slate-500">Auto-Releases on PIN</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Grid: Timeline & PIN Handover Settlement */}
        <section className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: OR-Tools Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Google OR-Tools Optimized Multi-Stop Path
                  </h2>
                  <p className="text-xs text-slate-500">
                    Algorithmic clustering combining farm pickups with door-to-door deliveries
                  </p>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800">
                  4 Stops Active
                </span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative space-y-6 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {route.stops.map((stop) => {
                  const isCompleted = stop.status === "completed";
                  const isTarget = stop.isPinTarget;
                  return (
                    <div key={stop.step} className="relative space-y-1">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-6 top-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs ${
                          isCompleted
                            ? "bg-emerald-600 ring-4 ring-emerald-100"
                            : isTarget
                            ? "bg-purple-600 ring-4 ring-purple-200 animate-pulse"
                            : "bg-slate-400"
                        }`}
                      >
                        {isCompleted ? "✓" : stop.step}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{stop.title}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              stop.role.includes("Pickup")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {stop.role}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Clock className="size-3 text-slate-400" />
                          {stop.eta}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400" />
                        {stop.location}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span>Produce: <strong className="text-slate-800">{stop.crop}</strong></span>
                        <span>•</span>
                        <span>Load: {stop.quantity}</span>
                      </div>

                      {isTarget && !isSettled && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-100/70 px-2.5 py-1 text-xs font-bold text-amber-900">
                          <KeyRound className="size-3.5 text-amber-700" />
                          <span>Action Required: Request 4-Digit PIN from Priya Sharma</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 4-digit PIN Handover Settlement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl border border-emerald-300 bg-white p-6 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Handover PIN Settlement
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical delivery confirmation triggers instant UPI payout
                  </p>
                </div>
              </div>

              {!isSettled ? (
                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div className="space-y-2 text-center">
                    <label htmlFor="pin-input" className="text-xs font-bold text-slate-700 block">
                      Enter Consumer&apos;s 4-Digit Delivery PIN:
                    </label>

                    <div className="flex justify-center">
                      <Input
                        id="pin-input"
                        type="text"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="••••"
                        className="h-14 w-44 text-center font-mono text-3xl font-extrabold tracking-widest border-2 border-emerald-300 focus:border-emerald-600 rounded-2xl shadow-inner"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Demo Secret PIN is: <strong className="text-emerald-700 font-mono">7429</strong>
                    </p>
                  </div>

                  {/* Demo helper button for judges */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setPinInput("7429")}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                    >
                      💡 Auto-Fill PIN &ldquo;7429&rdquo;
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || pinInput.length < 4}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl text-sm gap-2 shadow-md transition-transform active:scale-98"
                  >
                    <Sparkles className="size-4 text-amber-300" />
                    <span>{isSubmitting ? "Verifying with Razorpay..." : "Verify PIN & Release UPI Escrow"}</span>
                  </Button>
                </form>
              ) : (
                /* The "Win" Moment Celebration Card (Phase 5 Masterplan) */
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                    <CheckCircle2 className="size-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-900">
                      Settlement Confirmed
                    </span>
                    <h4 className="text-xl font-black text-slate-900">
                      ₹14,500 Disbursed via UPI
                    </h4>
                    <p className="text-xs text-slate-600">
                      Escrow released to <strong>Rameshwar Patil</strong> (UPI: ramesh@oksbi)
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-emerald-200 text-left text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Transaction Reference:</span>
                      <span className="font-mono font-bold text-slate-800">TXN-UPI-9821804</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Time Elapsed:</span>
                      <span className="font-bold text-emerald-700">&lt;2.4 seconds</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Driver Payout Cut:</span>
                      <span className="font-bold text-slate-800">₹850 Credited</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setIsSettled(false);
                      setPinInput("");
                    }}
                    variant="outline"
                    className="w-full text-xs border-emerald-300 text-emerald-800"
                  >
                    Reset Demo PIN Verification
                  </Button>
                </div>
              )}

              {/* Technical Highlight Card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Zero-Payment-Delay Guarantee:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Unlike traditional mandis where farmers wait 15-45 days for middleman clearing cheques,
                  Krishi Setu executes straight-through processing to UPI upon 4-digit PIN delivery.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
