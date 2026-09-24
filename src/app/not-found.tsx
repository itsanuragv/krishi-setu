import Link from "next/link";
import { ArrowLeft, Home, Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="size-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-2xl mb-6 flex items-center justify-center">
        <div className="size-full bg-slate-950 rounded-[22px] flex items-center justify-center">
          <Sprout className="size-10 text-emerald-400" />
        </div>
      </div>

      <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-2">
        404 • पृष्ठ नहीं मिला / Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
        यह रास्ता खेत तक नहीं जाता!
      </h1>

      <p className="text-slate-400 text-sm max-w-md mb-8">
        आप जिस पृष्ठ को ढूंढ रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है।
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/40"
        >
          <Home className="size-4" />
          <span>होमपेज पर जाएं</span>
        </Link>
        <Link
          href="/farmer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white font-semibold text-sm transition-all"
        >
          <ArrowLeft className="size-4" />
          <span>किसान पोर्टल</span>
        </Link>
      </div>
    </div>
  );
}
