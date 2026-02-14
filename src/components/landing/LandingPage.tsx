'use client';

import Link from 'next/link';
import {
    LayoutDashboard,
    Rocket,
    Zap,
    Shield,
    Users,
    CheckCircle2,
    ArrowRight,
    MessageCircle,
    Layers,
    ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen mesh-gradient text-slate-100 selection:bg-emerald-500/30">
            {/* Navbar */}
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 
                    ${scrolled || isMenuOpen
                        ? 'py-4 backdrop-blur-xl bg-slate-900/40'
                        : 'py-6 bg-transparent'}`}
            >

                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <DhaniyaaLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-black tracking-tighter text-white">Dhaniyaa</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Workflow</a>
                        <div className="h-4 w-[1px] bg-slate-800"></div>
                        <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
                        <Link href="/register" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Tablet View Drawer */}
                {isMenuOpen && (
                    <div
                        className="md:hidden absolute top-full left-0 w-full border-t border-white/10 p-6 space-y-4 animate-in slide-in-from-top-4 duration-500 flex flex-col shadow-2xl z-50 h-screen"
                        style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.98)', // Opaque background
                            backdropFilter: 'blur(20px)', // Subtle blur for depth
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-300 hover:text-white py-2">Features</a>
                        <a href="#workflow" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-300 hover:text-white py-2">Workflow</a>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-300 hover:text-white py-2">Login</Link>
                        <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-center text-lg active:scale-95 transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20">
                            Get Started Free
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none opacity-30">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Free to Use Forever
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-violet-300 text-[10px] font-black uppercase tracking-[0.2em]">
                                A Product of cookmytech
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Build. Ship. <span className="text-gradient">Dominate.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            Stop wrestling with clunky tools. Dhaniyaa makes project management effortless, powerful, and completely free. It's time to cook up something amazing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <Link href="/register" className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group">
                                Start Building for Free
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="px-8 py-4 rounded-2xl glass text-white font-black text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                Live Demo
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Preview Overlay */}
                    <div className="mt-24 relative group animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10"></div>
                        <div className="glass p-2 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-slate-900 border border-white/5 relative">
                                {/* Simulated UI Elements */}
                                <div className="absolute inset-0 p-8 flex flex-col gap-6">
                                    <div className="h-8 w-48 bg-white/5 rounded-lg flex items-center px-3 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-6 flex-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex flex-col gap-4">
                                                <div className="h-6 w-3/4 bg-white/10 rounded-md"></div>
                                                {[1, 2, 3].map(j => (
                                                    <div key={j} className="h-32 glass border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                                                        <div className="h-4 w-full bg-white/5 rounded"></div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="w-8 h-8 rounded-lg bg-white/5"></div>
                                                            <div className="w-12 h-4 bg-emerald-500/20 rounded"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                                    <div className="glass px-8 py-4 rounded-3xl border border-white/20 shadow-2xl text-2xl font-bold flex items-center gap-4 animate-float">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg"><Rocket className="text-white w-6 h-6" /></div>
                                        Experience The Speed of Free
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-32 relative bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything you need. <span className="text-violet-400">Zero Cost.</span></h2>
                        <p className="text-slate-400 font-bold tracking-wide uppercase text-xs">Powerful features without the price tag</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, color: 'text-violet-400', title: 'Lightning Fast', desc: 'Sprints, tasks, and issues update in real-time across your entire team.' },
                            { icon: Users, color: 'text-emerald-400', title: 'Team Collaboration', desc: 'Unlimited projects, organizations, and team members with seamless invites.' },
                            { icon: MessageCircle, color: 'text-blue-400', title: 'Rich Discussions', desc: 'Attach images, code snippets, and have threaded conversations on every ticket.' },
                            { icon: Shield, color: 'text-rose-400', title: 'Advanced Security', desc: 'Role-based access control and secure authentication for your sensitive data.' },
                            { icon: Rocket, color: 'text-amber-400', title: 'Cycle Velocity', desc: 'Interactive burn-down charts and cycle reports to track team performance.' },
                            { icon: LayoutDashboard, color: 'text-emerald-400', title: 'Modular Board', desc: 'Highly customizable Kanban boards with drag-and-drop functionality.' }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-[32px] glass hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="glass p-12 md:p-20 rounded-[48px] border border-white/10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">Ready to transform your <br /><span className="text-emerald-400">workflow for free?</span></h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/register" className="px-10 py-5 rounded-[24px] bg-emerald-500 text-white font-extrabold text-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                                Join Dhaniyaa Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <DhaniyaaLogo className="w-8 h-8" />
                            <span className="text-xl font-black tracking-tighter text-white">Dhaniyaa</span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold">
                            Proudly built by <span className="text-emerald-400">Cookmytech</span>.
                        </p>
                    </div>

                    <div className="flex gap-10 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                    <p className="text-slate-500 text-sm font-bold">© 2026 Dhaniyaa. All rights reserved.</p>
                </div>
            </footer>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
