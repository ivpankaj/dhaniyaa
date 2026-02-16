'use client';

import Image from 'next/image';

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
    ChevronRight,
    Bot,
    Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import DhaniyaaLogo from '@/components/DhaniyaaLogo';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-100 selection:bg-violet-500/30">
            {/* Navbar */}
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 
                    ${scrolled || isMenuOpen
                        ? 'py-4 backdrop-blur-xl bg-slate-900/40'
                        : 'py-6 bg-transparent'}`}
            >

                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <DhaniyaaLogo className="w-20 h-20 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-black tracking-tighter text-white -ml-9">Dhaniyaa</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Workflow</a>
                        <div className="h-4 w-[1px] bg-slate-800"></div>
                        <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
                        <Link href="/register" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all active:scale-95 shadow-lg shadow-violet-600/20">
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
                        <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-2xl bg-violet-600 text-white font-black text-center text-lg active:scale-95 transition-all hover:bg-violet-700 shadow-lg shadow-violet-600/20">
                            Get Started Free
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                                Free to Use Forever
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                A Product of cookmytech
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Build. Ship. <span className="text-violet-500 font-extrabold">Dominate.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            Stop wrestling with clunky tools. Dhaniyaa makes project management effortless, powerful, and completely free. It's time to cook up something amazing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <Link href="/register" className="px-8 py-4 rounded-2xl bg-violet-600 text-white font-black text-lg shadow-2xl shadow-violet-600/20 hover:bg-violet-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group">
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
                        <div className="absolute inset-0 bg-[#0d1117]/80 z-10"></div>
                        <div className="glass p-2 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-slate-900 border border-white/5 relative">
                                {/* Simulated UI Elements */}
                                <div className="absolute inset-0 p-8 flex flex-col gap-6">
                                    <div className="h-8 w-48 bg-white/5 rounded-lg flex items-center px-3 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-violet-400"></div>
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
                                                            <div className="w-12 h-4 bg-violet-500/20 rounded"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                                    <div className="glass px-8 py-4 rounded-3xl border border-white/20 shadow-2xl text-2xl font-bold flex items-center gap-4 animate-float">
                                        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg"><Rocket className="text-white w-6 h-6" /></div>
                                        Experience The Speed of Free
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Product Showcase Section - Kanban */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 bg-slate-800/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000"
                            alt="Kanban Board"
                            width={1000}
                            height={600}
                            className="w-full h-auto object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/40"></div>
                        {/* Mock UI Overlay */}
                        <div className="absolute top-8 left-8 right-8 bottom-8 flex gap-4">
                            <div className="w-1/3 bg-slate-800/80 backdrop-blur rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                                <div className="h-2 w-16 bg-red-400 rounded-full"></div>
                                <div className="h-16 bg-white/5 rounded-lg"></div>
                                <div className="h-16 bg-white/5 rounded-lg"></div>
                            </div>
                            <div className="w-1/3 bg-slate-800/80 backdrop-blur rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                                <div className="h-2 w-16 bg-amber-400 rounded-full"></div>
                                <div className="h-16 bg-white/5 rounded-lg"></div>
                            </div>
                            <div className="w-1/3 bg-slate-800/80 backdrop-blur rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                                <div className="h-2 w-16 bg-violet-400 rounded-full"></div>
                                <div className="h-24 bg-white/5 rounded-lg border-l-2 border-violet-600"></div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/10 text-slate-300 text-xs font-black uppercase tracking-wider mb-6 border border-slate-700/50">
                            Visual Workflow
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Master Your <span className="text-violet-500">Momentum</span>
                        </h3>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Drag, drop, and done. Our Kanban boards give you a bird's-eye view of your project status. Visualize blockers, track progress, and keep the team moving forward without the chaos.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Drag-and-drop interface',
                                'Customizable columns',
                                'Real-time updates'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-violet-600/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Product Showcase Section - Sprints */}
            <section className="py-24 relative overflow-hidden bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 text-violet-400 text-xs font-black uppercase tracking-wider mb-6 border border-violet-600/20">
                            Agile Sprints
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ship faster with <span className="text-violet-400">Focus</span>
                        </h3>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Break big goals into manageable 2-week cycles. Plan your sprints, assign story points, and track velocity with automatic burn-down charts. Stay aligned and deliver on time.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Sprint planning & backlog',
                                'Story point estimation',
                                'Automated velocity tracking'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-violet-600/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 bg-violet-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000"
                            alt="Sprint Planning"
                            width={1000}
                            height={600}
                            className="w-full h-auto object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/40"></div>
                        {/* Mock UI Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="glass px-8 py-6 rounded-2xl flex flex-col gap-4 border border-white/20">
                                <div className="flex justify-between items-end">
                                    <div className="text-2xl font-black text-white">Sprint 24</div>
                                    <div className="text-violet-400 font-bold">Active</div>
                                </div>
                                <div className="w-64 h-32 flex items-end gap-2 border-b border-white/10 pb-1">
                                    <div className="w-1/6 bg-violet-600/30 h-[80%] rounded-t-sm"></div>
                                    <div className="w-1/6 bg-violet-600/40 h-[70%] rounded-t-sm"></div>
                                    <div className="w-1/6 bg-violet-600/50 h-[60%] rounded-t-sm"></div>
                                    <div className="w-1/6 bg-violet-600/60 h-[40%] rounded-t-sm"></div>
                                    <div className="w-1/6 bg-violet-600/80 h-[20%] rounded-t-sm"></div>
                                    <div className="w-1/6 bg-violet-600 h-[10%] rounded-t-sm animate-pulse"></div>
                                </div>
                                <div className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">Burn Down Chart</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 relative bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything you need. <span className="text-violet-500">Zero Cost.</span></h2>
                        <p className="text-slate-400 font-bold tracking-wide uppercase text-xs">Powerful features without the price tag</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, color: 'text-violet-400', title: 'Lightning Fast', desc: 'Sprints, tasks, and issues update in real-time across your entire team.' },
                            { icon: Users, color: 'text-violet-400', title: 'Team Collaboration', desc: 'Unlimited projects, organizations, and team members with seamless invites.' },
                            { icon: MessageCircle, color: 'text-blue-400', title: 'Rich Discussions', desc: 'Attach images, code snippets, and have threaded conversations on every ticket.' },
                            { icon: Shield, color: 'text-rose-400', title: 'Advanced Security', desc: 'Role-based access control and secure authentication for your sensitive data.' },
                            { icon: Rocket, color: 'text-amber-400', title: 'Cycle Velocity', desc: 'Interactive burn-down charts and cycle reports to track team performance.' },
                            { icon: LayoutDashboard, color: 'text-violet-400', title: 'Modular Board', desc: 'Highly customizable Kanban boards with drag-and-drop functionality.' }
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

            {/* Workflow Section */}
            <section id="workflow" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Simple & Effective
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            From Idea to Launch in <span className="text-violet-600 font-black">4 Steps</span>
                        </h2>
                        <p className="text-slate-400 font-medium max-w-2xl mx-auto">
                            Dhaniyaa removes the friction so you can focus on building. Here is how your team will ship faster.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-700 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {[
                                {
                                    step: '01',
                                    title: 'Create Space',
                                    desc: 'Set up an Organization and Projects for your different products.',
                                    icon: Layers
                                },
                                {
                                    step: '02',
                                    title: 'Invite Squad',
                                    desc: 'Add your team members via email or magic link instantly.',
                                    icon: Users
                                },
                                {
                                    step: '03',
                                    title: 'Plan Sprints',
                                    desc: 'Create tasks, assign points, and start your 2-week cycle.',
                                    icon: LayoutDashboard
                                },
                                {
                                    step: '04',
                                    title: 'Ship & Track',
                                    desc: 'Move tickets to Done and watch your burn-down chart update.',
                                    icon: Rocket
                                }
                            ].map((item, i) => (
                                <div key={i} className="group relative">
                                    <div className="glass p-8 rounded-[32px] border border-white/5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-black text-white border-4 border-[#0f172a]">
                                                {item.step}
                                            </div>
                                            <item.icon className="w-7 h-7 text-slate-300 group-hover:text-violet-400 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Showcase Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 bg-amber-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
                            alt="AI Assistant"
                            width={1000}
                            height={600}
                            className="w-full h-auto object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/60"></div>
                        {/* Mock Chat UI */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="w-full max-w-sm glass rounded-2xl p-4 flex flex-col gap-3 border border-white/20">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Adrak AI</div>
                                        <div className="text-violet-400 text-[10px] font-bold">Online</div>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 rounded-tl-none text-xs text-slate-300">
                                    How do I create a new sprint?
                                </div>
                                <div className="bg-violet-600/80 rounded-lg p-3 rounded-tr-none text-xs text-white">
                                    Go to your project board, click the "Sprints" tab, and hit "Create Sprint". I can help you set up the dates!
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-wider mb-6 border border-amber-500/20">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            Meet Adrak
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Your Intelligent <span className="text-amber-400">Project Assistant</span>
                        </h3>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Stuck on a feature? Need to find a setting? Adrak is your built-in AI companion that knows Dhaniyaa inside out. Get instant answers, support, and guidance without leaving your dashboard.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Instant 24/7 Support',
                                'Context-aware guidance',
                                'Powered by Best AI tools'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="glass p-12 md:p-20 rounded-[48px] border border-white/10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">Ready to transform your <br /><span className="text-violet-400">workflow for free?</span></h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/register" className="px-10 py-5 rounded-[24px] bg-violet-600 text-white font-extrabold text-xl hover:bg-violet-700 transition-all active:scale-95 shadow-xl shadow-violet-600/20">
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
                            <DhaniyaaLogo className="w-20 h-20" />
                            <span className="text-xl font-black tracking-tighter text-white -ml-9">Dhaniyaa</span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold">
                            Proudly built by <a href="https://cookmytech.site" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">Cookmytech</a>.
                        </p>
                    </div>

                    <div className="flex gap-10 text-sm font-bold text-slate-500">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
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
