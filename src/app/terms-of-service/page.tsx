import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | Dhaniyaa',
    description: 'Terms of Service for Dhaniyaa Project Management Tool',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-8 font-bold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Terms of Service</h1>

                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600">
                        <p>Last updated: February 14, 2026</p>

                        <h3>1. Agreement to Terms</h3>
                        <p>By accessing our website and using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, including the mandatory arbitration provision and class action waiver, you may not use our services.</p>

                        <h3>2. Use of License</h3>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Dhaniyaa's website for personal, non-commercial transitory viewing only.</p>

                        <h3>3. User Accounts</h3>
                        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                        <h3>4. Intellectual Property</h3>
                        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Dhaniyaa and its licensors.</p>

                        <h3>5. Termination</h3>
                        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                        <h3>6. Changes to Terms</h3>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

                        <h3>7. Contact</h3>
                        <p>If you have any questions about these Terms, please contact us via our website at https://cookmytech.site.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
