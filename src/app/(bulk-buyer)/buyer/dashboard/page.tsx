"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Boxes,
  TrendingDown,
  FileText,
  Wallet,
  Search,
  Plus,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Truck,
  HandCoins,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS } from "@/lib/mock-data";
import {
  BUYER_PROFILE,
  MOCK_DEMANDS,
  MOCK_CONTRACTS,
  MOCK_MANDI_INTEL,
  type BuyerDemand,
} from "@/lib/buyer-mock";
import { LotCard } from "@/components/buyer/LotCard";
import { EscrowStages } from "@/components/buyer/EscrowStages";
import { cn } from "@/lib/utils";

type TabId = "lots" | "demand" | "contracts" | "intel";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function BuyerDashboardPage() {
  const { t, language } = useLanguage();
  const hi = language === "hi";
  const [tab, setTab] = useState<TabId>("lots");

  // ---- Lots filters ----
  const crops = useMemo(() => Array.from(new Set(MOCK_PRODUCE_LISTINGS.map((l) => l.name))), []);
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"savings" | "price" | "distance">("savings");
  const lots = useMemo(() => {
    const list = MOCK_PRODUCE_LISTINGS.filter((l) => cropFilter === "all" || l.name === cropFilter);
    return [...list].sort((a, b) => {
      if (sortBy === "price") return a.farmGatePrice - b.farmGatePrice;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      const sa = a.mandiBenchmarkPrice - a.farmGatePrice;
      const sb = b.mandiBenchmarkPrice - b.farmGatePrice;
      return sb - sa;
    });
  }, [cropFilter, sortBy]);

  // ---- Demand board (RFQ) ----
  const [demands, setDemands] = useState<BuyerDemand[]>(MOCK_DEMANDS);
  const [rfq, setRfq] = useState({ crop: "", qty: "", grade: "Grade A", price: "", deliveryBy: "" });
  const [showPin, setShowPin] = useState<Record<string, boolean>>({});

  const totalVolume = MOCK_CONTRACTS.filter((c) => c.status !== "settled").reduce((s, c) => s + c.quantity, 0);
  const avgSavings = Math.round(
    MOCK_CONTRACTS.reduce((s, c) => s + ((c.mandiPrice - c.agreedPrice) / c.mandiPrice) * 100, 0) /
      MOCK_CONTRACTS.length
  );
  const escrowLocked = MOCK_CONTRACTS.reduce((s, c) => s + c.escrowAmount, 0);
  const openDemands = demands.filter((d) => d.status === "open").length;

  const kpis = [
    { icon: Boxes, label: hi ? "अनुबंधित मात्रा" : "Contracted volume", value: `${totalVolume.toLocaleString("en-IN")} qtl`, sub: hi ? "सक्रिय अनुबंध" : "across active contracts", tone: "emerald" },
    { icon: TrendingDown, label: hi ? "मंडी बनाम औसत बचत" : "Avg. savings vs mandi", value: `${avgSavings}%`, sub: hi ? "प्रति क्विंटल" : "per quintal", tone: "teal" },
    { icon: FileText, label: hi ? "खुली मांगें (RFQ)" : "Open demands (RFQ)", value: String(openDemands), sub: hi ? `${demands.reduce((s, d) => s + d.bids, 0)} बोलियां मिलीं` : `${demands.reduce((s, d) => s + d.bids, 0)} bids received`, tone: "amber" },
    { icon: Wallet, label: hi ? "एस्क्रो में लॉक" : "Locked in escrow", value: inr(escrowLocked), sub: hi ? "सुरक्षित भुगतान" : "protected payouts", tone: "sky" },
  ];

  const tabs: { id: TabId; label: string; icon: typeof Search }[] = [
    { id: "lots", label: hi ? "कॉन्ट्रैक्ट लॉट" : "Contract lots", icon: Boxes },
    { id: "demand", label: hi ? "डिमांड बोर्ड" : "Demand board", icon: FileText },
    { id: "contracts", label: hi ? "मेरे अनुबंध" : "My contracts", icon: HandCoins },
    { id: "intel", label: hi ? "मंडी इंटेल" : "Price intel", icon: TrendingDown },
  ];

  const submitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfq.crop || !rfq.qty || !rfq.price) {
      toast.error(hi ? "फसल, मात्रा और लक्ष्य भाव भरें" : "Fill crop, quantity and target price");
      return;
    }
    const qty = Number(rfq.qty);
    const price = Number(rfq.price);
    const mandiRef = Math.round(price * 1.22);
    setDemands([
      {
        id: `dem-${Date.now()}`,
        crop: rfq.crop,
        cropHi: rfq.crop,
        quantity: qty,
        unit: "quintal",
        grade: rfq.grade,
        targetPrice: price,
        mandiPrice: mandiRef,
        deliveryBy: rfq.deliveryBy || (hi ? "जल्द से जल्द" : "ASAP"),
        deliveryLocation: BUYER_PROFILE.location,
        status: "open",
        bids: 0,
        postedAgo: hi ? "अभी" : "just now",
        postedAgoHi: "अभी",
      },
      ...demands,
    ]);
    setRfq({ crop: "", qty: "", grade: "Grade A", price: "", deliveryBy: "" });
    toast.success(hi ? "मांग डिमांड बोर्ड पर प्रकाशित!" : "Demand published to the board!");
  };

  return (
    <div className="space-y-5">
      {/* 1. Buyer identity header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow">
              <div className="flex size-full items-center justify-center text-xl font-black">M</div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 sm:text-xl">
                  {hi ? BUYER_PROFILE.nameHi : BUYER_PROFILE.name}
                </h1>
                {BUYER_PROFILE.gstVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                    <BadgeCheck className="size-3" />
                    {hi ? "GST सत्यापित" : "GST VERIFIED"}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {hi ? BUYER_PROFILE.typeHi : BUYER_PROFILE.type} • {BUYER_PROFILE.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="relative flex size-10 items-center justify-center">
                <svg viewBox="0 0 36 36" className="size-10 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#059669" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(BUYER_PROFILE.credibilityScore / 100) * 97.4} 97.4`}
                  />
                </svg>
                <span className="absolute text-[9px] font-black text-emerald-800">{BUYER_PROFILE.credibilityGrade}</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{BUYER_PROFILE.credibilityScore}/100</p>
                <p className="text-[10px] font-semibold text-slate-500">{hi ? "विश्वसनीयता स्कोर" : "Credibility score"}</p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
              <p className="text-sm font-black text-emerald-800">{inr(BUYER_PROFILE.escrowBalance)}</p>
              <p className="text-[10px] font-semibold text-emerald-700">{hi ? "एस्क्रो बैलेंस" : "Escrow balance"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KPI cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4">
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex size-8 items-center justify-center rounded-lg",
                k.tone === "emerald" && "bg-emerald-100 text-emerald-700",
                k.tone === "teal" && "bg-teal-100 text-teal-700",
                k.tone === "amber" && "bg-amber-100 text-amber-700",
                k.tone === "sky" && "bg-sky-100 text-sky-700"
              )}>
                <k.icon className="size-4" />
              </span>
              <p className="text-[11px] font-bold leading-tight text-slate-500">{k.label}</p>
            </div>
            <p className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">{k.value}</p>
            <p className="text-[11px] text-slate-500">{k.sub}</p>
          </div>
        ))}
      </section>

      {/* 3. Tabs */}
      <div className="sticky top-14 z-20 -mx-3 bg-background/95 px-3 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs no-scrollbar">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={cn(
                "flex min-h-[40px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-bold transition-all",
                tab === tb.id
                  ? "bg-emerald-700 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <tb.icon className="size-3.5" />
              {tb.label}
              {tb.id === "demand" && openDemands > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 text-[10px] font-black",
                  tab === "demand" ? "bg-white/25 text-white" : "bg-amber-100 text-amber-800"
                )}>
                  {openDemands}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: Contract lots */}
      {tab === "lots" && (
        <section className="space-y-4">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-1.5 overflow-x-auto no-scrollbar">
              {["all", ...crops].map((c) => (
                <button
                  key={c}
                  onClick={() => setCropFilter(c)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
                    cropFilter === c
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                  )}
                >
                  {c === "all" ? (hi ? "सभी" : "All") : c.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700"
            >
              <option value="savings">{hi ? "सबसे ज्यादा बचत" : "Highest savings"}</option>
              <option value="price">{hi ? "सबसे कम भाव" : "Lowest price"}</option>
              <option value="distance">{hi ? "नजदीकी पहले" : "Nearest first"}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-black text-emerald-950">
                {hi ? "सही लॉट नहीं मिला?" : "Can't find the right lot?"}
              </p>
              <p className="text-xs text-emerald-800">
                {hi
                  ? "अपनी मांग पोस्ट करें — सत्यापित FPO और किसान खुद बोली लगाएंगे।"
                  : "Post your demand — verified FPOs and farmers will bid on it."}
              </p>
            </div>
            <Button onClick={() => setTab("demand")} className="shrink-0 rounded-xl bg-emerald-700 font-bold text-white hover:bg-emerald-800">
              <Plus className="size-4" />
              {hi ? "मांग पोस्ट करें" : "Post a demand"}
            </Button>
          </div>
        </section>
      )}

      {/* TAB: Demand board */}
      {tab === "demand" && (
        <section className="grid gap-4 lg:grid-cols-5">
          <form onSubmit={submitRfq} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 lg:col-span-2">
            <div>
              <h3 className="text-sm font-black text-slate-900">{hi ? "नई मांग पोस्ट करें (RFQ)" : "Post a new demand (RFQ)"}</h3>
              <p className="text-[11px] text-slate-500">
                {hi ? "रिवर्स नीलामी: किसान आपकी शर्तों पर बोली लगाएंगे" : "Reverse auction: farmers bid on your terms"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold">{hi ? "फसल" : "Crop"} *</Label>
              <Input value={rfq.crop} onChange={(e) => setRfq({ ...rfq, crop: e.target.value })} placeholder={hi ? "जैसे: शरबती गेहूं" : "e.g. Sharbati Wheat"} className="h-11 rounded-xl text-sm font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold">{hi ? "मात्रा (क्विंटल)" : "Qty (quintal)"} *</Label>
                <Input type="number" min={1} value={rfq.qty} onChange={(e) => setRfq({ ...rfq, qty: e.target.value })} placeholder="500" className="h-11 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">{hi ? "ग्रेड" : "Grade"}</Label>
                <select value={rfq.grade} onChange={(e) => setRfq({ ...rfq, grade: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-bold">
                  <option>Grade A</option>
                  <option>Grade B</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold">{hi ? "लक्ष्य भाव (₹/क्विं.)" : "Target price (₹/qtl)"} *</Label>
                <Input type="number" min={1} value={rfq.price} onChange={(e) => setRfq({ ...rfq, price: e.target.value })} placeholder="2700" className="h-11 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">{hi ? "डिलीवरी तिथि" : "Delivery by"}</Label>
                <Input type="date" value={rfq.deliveryBy} onChange={(e) => setRfq({ ...rfq, deliveryBy: e.target.value })} className="h-11 rounded-xl text-sm" />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-700 text-sm font-black text-white hover:bg-emerald-800">
              <Plus className="size-4" />
              {hi ? "डिमांड बोर्ड पर डालें" : "Publish to demand board"}
            </Button>
            <p className="text-[10px] leading-relaxed text-slate-400">
              {hi
                ? "नोट: मांग प्रकाशित होते ही 25 किमी के दायरे के सत्यापित किसानों को सूचना जाएगी।"
                : "Note: verified farmers within 25 km are notified the moment a demand goes live."}
            </p>
          </form>

          <div className="space-y-3 lg:col-span-3">
            {demands.map((d) => (
              <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{hi ? d.cropHi : d.crop}</h4>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black",
                        d.status === "open" && "bg-emerald-100 text-emerald-800",
                        d.status === "matched" && "bg-sky-100 text-sky-800",
                        d.status === "fulfilled" && "bg-slate-100 text-slate-600"
                      )}>
                        {d.status === "open" ? (hi ? "खुली" : "OPEN") : d.status === "matched" ? (hi ? "मिलान हुआ" : "MATCHED") : (hi ? "पूर्ण" : "FULFILLED")}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{d.grade}</span>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1"><Boxes className="size-3" />{d.quantity} {d.unit}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{d.deliveryLocation}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" />{d.deliveryBy}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-amber-50 px-2.5 py-1.5 text-center">
                    <span className="block text-base font-black text-amber-700">{d.bids}</span>
                    <span className="block text-[9px] font-bold text-amber-700">{hi ? "बोलियां" : "bids"}</span>
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div className="text-[11px]">
                    <span className="text-slate-500">{hi ? "लक्ष्य: " : "Target: "}</span>
                    <span className="font-black text-emerald-700">{inr(d.targetPrice)}/{d.unit}</span>
                    <span className="ml-2 text-slate-400 line-through">{inr(d.mandiPrice)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-xl border-emerald-300 text-[11px] font-bold text-emerald-800"
                    onClick={() => toast.success(hi ? "बोलियां देखी जा रही हैं" : "Opening bid comparison")}
                  >
                    {hi ? "बोलियां देखें" : "Compare bids"}
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB: My contracts */}
      {tab === "contracts" && (
        <section className="space-y-4">
          {MOCK_CONTRACTS.map((c) => {
            const lotValue = c.quantity * c.agreedPrice;
            const saved = (c.mandiPrice - c.agreedPrice) * c.quantity;
            return (
              <div key={c.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{hi ? c.lotNameHi : c.lotName}</h4>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">{c.contractNo}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {c.counterpartyType === "FPO" ? (hi ? "FPO समूह: " : "FPO: ") : (hi ? "किसान: " : "Farmer: ")}
                      <span className="font-bold text-slate-700">{hi ? c.counterpartyHi : c.counterparty}</span>
                      {" • "}{c.quantity} {c.unit} @ {inr(c.agreedPrice)}/{c.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-slate-900">{inr(lotValue)}</p>
                    <p className="text-[10px] font-bold text-emerald-700">
                      {hi ? `≈ ${inr(saved)} बचत` : `≈ ${inr(saved)} saved`}
                    </p>
                  </div>
                </div>

                <EscrowStages stage={c.escrowStage} />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Truck className="size-3.5 text-slate-400" />
                    {hi ? "डिलीवरी: " : "Delivery: "}{c.deliveryDate}
                    {c.status !== "settled" && (
                      <button
                        onClick={() => setShowPin({ ...showPin, [c.id]: !showPin[c.id] })}
                        className="ml-1 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-black text-slate-700"
                      >
                        {showPin[c.id] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                        {hi ? "हैंडओवर PIN: " : "Handover PIN: "}
                        {showPin[c.id] ? c.handoverPin : "••••"}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {c.status !== "settled" ? (
                      <>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl text-[11px] font-bold"
                          onClick={() => toast.success(hi ? "विवाद दर्ज किया गया" : "Dispute raised with admin")}>
                          {hi ? "विवाद" : "Dispute"}
                        </Button>
                        <Button size="sm" className="h-9 rounded-xl bg-emerald-700 text-[11px] font-bold text-white hover:bg-emerald-800"
                          onClick={() => toast.success(hi ? "डिलीवरी ट्रैक हो रही है" : "Tracking delivery")}>
                          {hi ? "ट्रैक करें" : "Track"}
                        </Button>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-black text-emerald-800">
                        <BadgeCheck className="size-3.5" />
                        {hi ? "निपटान पूर्ण • GST इनवॉइस तैयार" : "Settled • GST invoice ready"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* TAB: Price intelligence */}
      {tab === "intel" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 p-4">
            <h3 className="text-sm font-black text-slate-900">
              {hi ? "मंडी बनाम फार्म-गेट — आज का अंतर" : "Mandi vs farm-gate — today's spread"}
            </h3>
            <p className="text-[11px] text-slate-500">
              {hi ? "इंदौर APMC बेंचमार्क • प्रति क्विंटल" : "Indore APMC benchmark • per quintal"}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_MANDI_INTEL.map((row) => {
              const save = row.mandiPrice - row.farmGateAvg;
              const pct = Math.round((save / row.mandiPrice) * 100);
              return (
                <div key={row.crop} className="flex items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-slate-900 sm:text-sm">{hi ? row.cropHi : row.crop}</p>
                    <p className="text-[10px] text-slate-500">{hi ? "आवक: " : "Arrivals: "}{row.arrivals}</p>
                  </div>
                  <div className="hidden w-40 sm:block">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(100, pct * 3)}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 line-through">{inr(row.mandiPrice)}</p>
                    <p className="text-sm font-black text-emerald-700">{inr(row.farmGateAvg)}</p>
                  </div>
                  <span className={cn(
                    "inline-flex w-16 items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-black",
                    row.trend === "up" && "bg-rose-50 text-rose-700",
                    row.trend === "down" && "bg-emerald-50 text-emerald-700",
                    row.trend === "stable" && "bg-slate-100 text-slate-600"
                  )}>
                    {row.trend === "up" ? <ArrowUpRight className="size-3" /> : row.trend === "down" ? <ArrowDownRight className="size-3" /> : <Minus className="size-3" />}
                    {row.trendPct}%
                  </span>
                  <span className="hidden w-20 text-right text-[11px] font-black text-emerald-700 md:block">
                    {hi ? `${pct}% बचत` : `${pct}% save`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/60 p-3.5 text-[11px] text-slate-500">
            {hi
              ? "टिप: मंडी भाव में गिरावट का मतलब है खरीदारी का सही समय — डिमांड बोर्ड पर RFQ डालें।"
              : "Tip: a falling mandi trend is the right time to buy — post an RFQ on the demand board."}
          </div>
        </section>
      )}
    </div>
  );
}
