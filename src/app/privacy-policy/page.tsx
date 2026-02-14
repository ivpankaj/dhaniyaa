import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | Dhaniyaa',
    description: 'Privacy Policy for Dhaniyaa Project Management Tool',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 font-bold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600">
                        <p>Last updated: February 14, 2026</p>

                        <h3>1. Introduction</h3>
                        <p>Welcome to Dhaniyaa ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you use our website and services.</p>

                        <h3>2. Information We Collect</h3>
                        <p>We collect information that you provide onto us, such as:</p>
                        <ul>
                            <li>Personal information (Name, Email address) when you register.</li>
                            <li>Project and task data you create while using our service.</li>
                            <li>Usage data and cookies to improve your experience.</li>
                        </ul>

                        <h3>3. How We Use Your Information</h3>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Provide, operate, and maintain our services.</li>
                            <li>Improve, personalize, and expand our website.</li>
                            <li>Understand and analyze how you use our website.</li>
                            <li>Communicate with you regarding updates and support.</li>
                        </ul>

                        <h3>4. Data Security</h3>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>

                        <h3>5. Third-Party Services</h3>
                        <p>We may use third-party services (such as Google Analytics and Firebase) that collect, monitor, and analyze this type of information to increase our service's functionality.</p>

                        <h3>6. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us at ivpnkz@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
