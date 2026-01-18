import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail, Lock, Terminal } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";

/**
 * DESIGN PHILOSOPHY: Terminal de Autenticação da Academia
 * - Estética minimalista e "Gated"
 * - Foco total em autoridade e exclusividade
 */

export default function Login() {
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Bypassing real auth for demo purposes, setting "fake" auth in localStorage
    localStorage.setItem("ez_auth", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-void-blue text-white flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 text-primary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2">PORTAL DO HERÓI</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
            Autentique-se para Acessar a Academia
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 px-1">E-mail de Recruta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  placeholder="recruta@futuro.com"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 px-1">Chave de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-primary text-background font-bold text-lg uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center justify-center gap-2"
            >
              Entrar na Academia <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-white/40 mb-4">Ainda não recebeu seu convite?</p>
            <Button 
              variant="outline"
              className="w-full h-12 border-white/10 text-white/60 hover:text-white"
              onClick={() => navigate("/")}
            >
              Voltar para Base
            </Button>
          </div>
        </div>

        {/* Terminal Hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <Terminal size={12} /> status: authentication_required // env: production
        </div>
      </motion.div>
    </div>
  );
}
