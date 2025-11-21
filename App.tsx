
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState, DrawStats, UserProfile, Report, LuckyNumber } from './types';
import { TICKET_PRICE, INITIAL_PRIZE, PRIZE_PERCENTAGE, MOCK_WINNERS, TRANSPARENCY_REPORTS } from './constants';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { 
  Trophy, CheckCircle2, Info, Gift, Share2, Copy, Star, Bell, FileText, Megaphone, TrendingUp,
  Activity, Sparkles, Zap, Dices, Check, User, LogOut, Ticket, Lock, Mail, Phone
} from './components/Icons';
import { getPrizeDream, getTransparencyExplanation, getReportSummary } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Visual Effects Components ---

const MoneyRain = () => {
  const [particles, setParticles] = useState<Array<{id: number, left: string, duration: string, delay: string, size: string}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 1.5 + 0.5}rem`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {particles.map(p => (
        <div 
          key={p.id}
          className="money-particle absolute text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            fontSize: p.size
          }}
        >
          $
        </div>
      ))}
    </div>
  );
};

const WinnerMarquee = () => {
    const winners = [
        "🔥 Carlos S. (Ticket #042) acabou de ganhar!",
        "💰 Maria P. (Ticket #108) sacou agora!",
        "🚀 João L. comprou Ticket #255!",
        "💎 Ana B. ganhou 5 tickets grátis!",
    ];

    return (
        <div className="bg-gradient-to-r from-black via-yellow-900/80 to-black border-b border-yellow-600/30 py-1 overflow-hidden relative z-50 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            <div className="animate-marquee whitespace-nowrap flex gap-8 text-xs font-bold text-yellow-400 uppercase tracking-wider items-center">
                {winners.map((w, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <Ticket size={10} className="text-white animate-pulse" /> {w}
                    </span>
                ))}
                {winners.map((w, i) => (
                    <span key={`dup-${i}`} className="flex items-center gap-2">
                        <Ticket size={10} className="text-white animate-pulse" /> {w}
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- Treasure Chest Component ---

interface TreasureChestProps {
  fillPercentage: number;
  isExploding: boolean;
}

const TreasureChest: React.FC<TreasureChestProps> = ({ fillPercentage, isExploding }) => {
  const fill = Math.min(Math.max(fillPercentage, 0), 100);
  const liquidHeight = 80 - (fill * 0.4);
  const shakeClass = isExploding ? 'animate-[shake_0.1s_infinite]' : fill > 80 ? 'animate-[shake_2s_infinite]' : '';

  return (
    <div className={`relative w-64 h-64 mx-auto transition-all duration-200 ${isExploding ? 'scale-125' : 'scale-100'} ${shakeClass}`}>
      
      {/* Explosive Flash */}
      <div className={`absolute inset-0 bg-white rounded-full blur-3xl transition-opacity duration-100 ${isExploding ? 'opacity-90' : 'opacity-0'} z-50 pointer-events-none`}></div>

      {/* Ambient Glow */}
      <div className={`absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full transition-all duration-300 ${isExploding ? 'opacity-100 scale-150 bg-yellow-400/60' : 'opacity-50'}`}></div>
      
      {/* Exploding Coins Particles */}
      {isExploding && (
         <>
            {[...Array(20)].map((_, i) => (
              <div key={i} 
                className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)] border border-white/50 z-50"
                style={{
                  transform: `translate(-50%, -50%)`,
                  animation: `flyOut-${i} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`
                }}
              >
                <style>{`
                  @keyframes flyOut-${i} {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                    100% { transform: translate(calc(-50% + ${(Math.random() - 0.5) * 600}px), calc(-50% + ${(Math.random() - 0.5) * 600}px)) scale(1.5) rotate(${Math.random() * 720}deg); opacity: 0; }
                  }
                `}</style>
              </div>
            ))}
         </>
      )}

      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-visible relative z-20">
        <defs>
           <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#fef9c3" /> 
             <stop offset="30%" stopColor="#facc15" />
             <stop offset="70%" stopColor="#ca8a04" />
             <stop offset="100%" stopColor="#854d0e" />
           </linearGradient>
           
           <linearGradient id="shinyGold" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#ca8a04" />
             <stop offset="40%" stopColor="#fef08a" /> 
             <stop offset="60%" stopColor="#eab308" />
             <stop offset="100%" stopColor="#a16207" />
           </linearGradient>

           <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="2" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
           </filter>
           
           <mask id="chestMask">
             <path d="M10,40 Q10,90 50,95 Q90,90 90,40 Z" fill="white" />
           </mask>
        </defs>

        {/* Falling Coins Animation */}
        {(!isExploding && fill < 100) && (
           <g opacity="0.9">
             {[...Array(5)].map((_, i) => (
               <circle key={i} r="3" fill="#fef08a" className="drop-shadow-md">
                 <animate 
                   attributeName="cy" 
                   from="-20" 
                   to="60" 
                   dur={`${0.5 + i * 0.1}s`} 
                   repeatCount="indefinite" 
                   begin={`${i * 0.2}s`}
                 />
                 <animate 
                   attributeName="cx" 
                   values={`${45 + (Math.random()-0.5)*10};${45 + (Math.random()-0.5)*10}`}
                   dur="1s" 
                   repeatCount="indefinite"
                 />
               </circle>
             ))}
           </g>
        )}

        <path d="M10,35 Q10,90 50,95 Q90,90 90,35 L90,35 Z" fill="#451a03" stroke="#78350f" strokeWidth="2" />

        <g mask="url(#chestMask)">
           <rect x="0" y="0" width="100" height="100" fill="#290b03" />
           <rect 
             x="0" 
             y={liquidHeight} 
             width="100" 
             height="100" 
             fill="url(#goldGradient)"
             className="transition-all duration-1000 ease-out"
           />
           <g transform={`translate(0, ${liquidHeight})`}>
             <circle cx="20" cy="5" r="4" fill="url(#shinyGold)" opacity="0.8" />
             <circle cx="40" cy="2" r="5" fill="url(#shinyGold)" />
             <circle cx="60" cy="6" r="3" fill="url(#shinyGold)" opacity="0.9" />
             <circle cx="80" cy="3" r="4" fill="url(#shinyGold)" />
           </g>
        </g>

        <path d="M10,35 Q10,90 50,95 Q90,90 90,35" fill="none" stroke="url(#shinyGold)" strokeWidth="5" filter="url(#glow)" />
        <path d="M50,35 L50,95" stroke="url(#shinyGold)" strokeWidth="10" />
        
        <circle cx="50" cy="55" r="7" fill="#171717" stroke="#facc15" strokeWidth="2" />
        <path d="M50,52 L50,58" stroke="#facc15" strokeWidth="2" />

        <g className={`transition-all duration-200 origin-bottom ${isExploding ? '-rotate-[120deg] -translate-y-12' : 'rotate-0'}`} style={{ transformOrigin: '50% 35%' }}>
           <path d="M5,35 Q50,5 95,35" fill="#5e2805" stroke="#78350f" strokeWidth="2" />
           <path d="M5,35 Q50,5 95,35" fill="none" stroke="url(#shinyGold)" strokeWidth="4" strokeDasharray="10,80,10" />
           <path d="M45,15 L55,15 L55,35 L45,35 Z" fill="url(#shinyGold)" stroke="white" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

// --- Auth Components ---

interface AuthScreenProps {
    onLogin: (userData: Partial<UserProfile>) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulating API call
        setTimeout(() => {
            setIsLoading(false);
            if (isRegister && formData.password !== formData.confirmPassword) {
                alert("Senhas não conferem!");
                return;
            }
            
            onLogin({
                name: formData.name || "Usuário",
                email: formData.email,
                phone: formData.phone
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>
            <MoneyRain />
            
            <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(234,179,8,0.2)] relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter italic text-white mb-2">
                        JOGOU <span className="text-yellow-500">GANHOU</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Sua sorte começa agora.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Nome Completo"
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required={isRegister}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-slate-500" size={20} />
                                <input 
                                    type="tel" 
                                    placeholder="Telefone"
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    required={isRegister}
                                />
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            type="email" 
                            placeholder="E-mail"
                            className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            type="password" 
                            placeholder="Senha"
                            className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    {isRegister && (
                        <div className="relative animate-fade-in">
                            <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                            <input 
                                type="password" 
                                placeholder="Confirmar Senha"
                                className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                required={isRegister}
                            />
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-black py-4 rounded-xl shadow-[0_5px_20px_rgba(234,179,8,0.4)] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Activity className="animate-spin" /> : (isRegister ? 'Criar Conta' : 'Entrar')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline decoration-slate-700 hover:decoration-white"
                    >
                        {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Criar agora'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Profile Screen (User Area) ---

const ProfileScreen: React.FC<{ user: UserProfile; onLogout: () => void }> = ({ user, onLogout }) => {
    return (
        <div className="pb-24 max-w-md mx-auto min-h-screen bg-black animate-fade-in text-slate-200">
            <div className="bg-gradient-to-b from-slate-900 to-black p-6 pt-12 border-b border-slate-800">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Olá, <span className="text-yellow-500">{user.name}</span></h1>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 bg-slate-800 rounded-lg hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Saldo de Tickets</p>
                        <p className="text-2xl font-black text-white">{user.tickets.length} <span className="text-sm text-slate-500 font-medium">ativos</span></p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <Ticket className="text-yellow-500" size={24} />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History size={18} className="text-emerald-400" />
                    Meus Números da Sorte
                </h2>
                
                <div className="space-y-3">
                    {user.tickets.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                            <p>Você ainda não participou de nenhum sorteio.</p>
                        </div>
                    ) : (
                        user.tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-700"></div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Número da Sorte</p>
                                    <p className="text-2xl font-black text-white font-mono tracking-widest">#{ticket.number}</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase border border-emerald-500/30">
                                        Participando
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">{ticket.purchaseDate}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Payment Modal ---

interface PaymentModalProps {
    onClose: () => void;
    onConfirm: () => void;
    price: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onConfirm, price }) => {
    const pixPayload = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Jogou Ganhou6008Sao Paulo62070503***6304";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(pixPayload)}`;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-fade-in">
            <div className="bg-slate-900 border border-yellow-500/40 rounded-3xl w-full max-w-sm relative overflow-hidden shadow-[0_0_60px_rgba(234,179,8,0.2)]">
                <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 p-4 text-center shadow-lg">
                    <h2 className="text-xl font-black text-black uppercase tracking-tight">Pagamento via PIX</h2>
                    <p className="text-yellow-900 font-bold text-xs">Escaneie o QR Code para gerar seu número</p>
                </div>

                <div className="p-6 flex flex-col items-center gap-6">
                    <div className="bg-black/50 border border-yellow-500/30 px-6 py-2 rounded-full flex items-center gap-3">
                        <span className="text-slate-400 text-xs uppercase font-bold">Total:</span>
                        <span className="text-2xl font-black text-emerald-400">R$ {price.toFixed(2)}</span>
                    </div>

                    <div className="relative group bg-white p-2 rounded-xl shadow-2xl">
                        <img 
                            src={qrCodeUrl} 
                            alt="QR Code PIX" 
                            className="w-56 h-56 object-contain mix-blend-multiply"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 w-full">
                        <button 
                            onClick={onClose}
                            className="py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-xl shadow-[0_5px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm group"
                        >
                            <Check size={18} strokeWidth={3} className="group-active:scale-125 transition-transform" />
                            CONFIRMAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Roulette Component ---

interface RouletteModalProps {
    onClose: () => void;
    onWin: (boost: string) => void;
}

const RouletteModal: React.FC<RouletteModalProps> = ({ onClose, onWin }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        const spinAmount = 1800 + Math.random() * 360;
        setRotation(prev => prev + spinAmount);

        setTimeout(() => {
            const r = Math.random() * 100;
            let won = r < 40 ? "+10% SORTE" : r < 70 ? "+15% SORTE" : r < 95 ? "+20% SORTE" : "JACKPOT";
            setResult(won);
            setSpinning(false);
            setTimeout(() => {
                onWin(won);
                onClose();
            }, 2000);
        }, 4000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border-2 border-yellow-600 rounded-3xl p-6 w-full max-w-xs text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                <h2 className="text-2xl font-black text-white mb-1 uppercase italic">Roleta da <span className="text-yellow-500">Sorte</span></h2>
                <div className="relative w-64 h-64 mx-auto mb-8 mt-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 z-20 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-red-600"></div>
                    <div 
                        className="w-full h-full rounded-full border-4 border-yellow-600 relative overflow-hidden bg-slate-800"
                        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4s cubic-bezier(0.1, 0.05, 0.1, 1)' }}
                    >
                        <div className="absolute inset-0 bg-[conic-gradient(#eab308_0deg_60deg,#ca8a04_60deg_120deg,#eab308_120deg_180deg,#ca8a04_180deg_240deg,#eab308_240deg_300deg,#ca8a04_300deg_360deg)]"></div>
                    </div>
                </div>
                {result ? (
                    <div className="text-yellow-400 font-black text-3xl animate-bounce">{result}</div>
                ) : (
                    <button 
                        onClick={handleSpin}
                        disabled={spinning}
                        className="w-full bg-red-600 text-white font-black text-xl py-4 rounded-xl shadow-[0_5px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none"
                    >
                        {spinning ? 'GIRANDO...' : 'GIRAR'}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Screen Components ---

const HomeScreen: React.FC<{ 
  stats: DrawStats; 
  onParticipateClick: () => void; 
  isShaking: boolean;
  user: UserProfile;
  onOpenRoulette: () => void;
  winMessage: string | null;
}> = ({ stats, onParticipateClick, isShaking, user, onOpenRoulette, winMessage }) => {
  return (
    <div className={`pb-24 relative ${isShaking ? 'animate-shake' : ''}`}>
      <MoneyRain />
      <WinnerMarquee />
      
      {/* Header */}
      <header className="pt-6 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">
              <span className="text-white">JOGOU</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600">GANHOU</span>
            </h1>
            <p className="text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 mt-1">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               Sorteio Automático
            </p>
          </div>
          <div className="bg-black/80 border border-yellow-500/50 p-2.5 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-bounce-slow">
            <Trophy size={24} className="text-yellow-400" />
          </div>
        </div>
      </header>

      {/* Prize Display - CHEST FOCUSED */}
      <div className="mx-4 -mt-12 relative z-20 max-w-md md:mx-auto">
        <div className="bg-black border-2 border-yellow-600 rounded-3xl p-1 relative shadow-[0_0_40px_rgba(234,179,8,0.15)]">
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-[1.3rem] p-6 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base