import Link from "next/link";
import { Calendar, LayoutDashboard, Settings, PlusCircle, FileBarChart, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-md w-full space-y-10 py-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 mb-6 rotate-3">
            <Calendar className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Escala Certa</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Sua rotina de plantões <span className="text-primary font-bold">12x36</span> sob controle total.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center p-5 sm:p-6 bg-card border rounded-3xl hover:border-primary/50 hover:shadow-xl transition-all group active:scale-95"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
          <Link
            href="/calendario"
            className="flex flex-col items-center justify-center p-5 sm:p-6 bg-card border rounded-3xl hover:border-primary/50 hover:shadow-xl transition-all group active:scale-95"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-bold text-sm">Escala</span>
          </Link>
          <Link
            href="/relatorio"
            className="flex flex-col items-center justify-center p-5 sm:p-6 bg-card border rounded-3xl hover:border-primary/50 hover:shadow-xl transition-all group active:scale-95"
          >
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
              <FileBarChart className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-bold text-sm">Relatório</span>
          </Link>
          <Link
            href="/configuracoes"
            className="flex flex-col items-center justify-center p-5 sm:p-6 bg-card border rounded-3xl hover:border-primary/50 hover:shadow-xl transition-all group active:scale-95"
          >
            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-bold text-sm">Ajustes</span>
          </Link>
        </div>

        <div className="pt-8 animate-in fade-in duration-1000">
          <div className="flex items-center justify-center gap-2 text-muted-foreground bg-secondary/50 py-2 px-4 rounded-full w-fit mx-auto border">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Pronto para uso offline</span>
          </div>
        </div>
      </div>
    </main>
  );
}
