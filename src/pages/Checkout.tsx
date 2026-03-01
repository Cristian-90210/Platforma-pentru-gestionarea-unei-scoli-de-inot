import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    CreditCard, Lock, CheckCircle, ArrowLeft,
    User, Mail, Phone, Calendar, ShieldCheck
} from 'lucide-react';

/* ─── Formatare număr card ─── */
function formatCardNumber(value: string) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

/* ─── Detectare brand card ─── */
function detectBrand(number: string): string {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'VISA';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return '';
}

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();

    /* form state */
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        cardNumber: '', cardHolder: '', expiry: '', cvv: '',
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [flipped, setFlipped] = useState(false);

    const brand = detectBrand(form.cardNumber);

    /* dacă coșul e gol, redirect la coș */
    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1e2d] gap-4">
                <p className="text-gray-600 dark:text-gray-300 text-lg">Coșul este gol.</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="px-6 py-3 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-full"
                >
                    Vezi Abonamente
                </button>
            </div>
        );
    }

    /* Validare */
    function validate() {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = 'Câmp obligatoriu';
        if (!form.email.includes('@')) e.email = 'Email invalid';
        if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Număr invalid';
        if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Număr card incomplet';
        if (!form.cardHolder.trim()) e.cardHolder = 'Câmp obligatoriu';
        if (form.expiry.length < 5) e.expiry = 'Dată invalidă';
        if (form.cvv.length < 3) e.cvv = 'CVV invalid';
        return e;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 2200)); // simulare procesare
        setIsLoading(false);
        setIsSuccess(true);
        clearCart();
    }

    function handleChange(field: keyof typeof form, raw: string) {
        let value = raw;
        if (field === 'cardNumber') value = formatCardNumber(raw);
        if (field === 'expiry') value = formatExpiry(raw);
        if (field === 'cvv') value = raw.replace(/\D/g, '').slice(0, 4);
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    /* ─── SUCCESS SCREEN ─── */
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1e2d] flex items-center justify-center px-4">
                <div className="text-center max-w-md animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-14 h-14 text-emerald-400 animate-in zoom-in duration-700" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Plată reușită! 🎉</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        Abonamentul tău a fost activat cu succes.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                        Un email de confirmare a fost trimis la <span className="text-host-cyan font-medium">{form.email}</span>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                        Mergi la Pagina Principală
                    </button>
                </div>
            </div>
        );
    }

    /* ─── CHECKOUT FORM ─── */
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1e2d] pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="p-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-[#00c6ff] transition-colors shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                            <CreditCard className="text-[#00c6ff]" size={28} />
                            Finalizare Comandă
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 flex items-center gap-1">
                            <Lock size={13} className="text-emerald-400" /> Plată securizată și criptată
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* ─── FORMULAR ─── */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">

                        {/* Date personale */}
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                                <User size={18} className="text-[#00c6ff]" /> Date Personale
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Nume complet" icon={<User size={15} />} error={errors.name}>
                                    <input
                                        type="text"
                                        placeholder="Ion Popescu"
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className={inputCls(!!errors.name)}
                                    />
                                </Field>
                                <Field label="Email" icon={<Mail size={15} />} error={errors.email}>
                                    <input
                                        type="email"
                                        placeholder="ion@email.com"
                                        value={form.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        className={inputCls(!!errors.email)}
                                    />
                                </Field>
                                <Field label="Telefon" icon={<Phone size={15} />} error={errors.phone} className="sm:col-span-2">
                                    <input
                                        type="tel"
                                        placeholder="+373 60 000 000"
                                        value={form.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                        className={inputCls(!!errors.phone)}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Date card */}
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                                <CreditCard size={18} className="text-[#00c6ff]" /> Date Card Bancar
                            </h2>

                            {/* Card preview */}
                            <div
                                className="relative h-44 rounded-2xl mb-6 overflow-hidden cursor-pointer select-none"
                                style={{ perspective: '1000px' }}
                                onClick={() => setFlipped(f => !f)}
                            >
                                <div
                                    className="absolute inset-0 transition-all duration-700"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}
                                >
                                    {/* Față */}
                                    <div
                                        className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
                                        style={{
                                            background: 'linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%)',
                                            backfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-7 rounded bg-yellow-400/80 flex items-center justify-center text-[8px] font-bold text-gray-900">CHIP</div>
                                            <span className="text-white font-bold text-lg tracking-widest opacity-80">{brand || 'CARD'}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-mono text-xl tracking-[0.25em] mb-3">
                                                {form.cardNumber || '•••• •••• •••• ••••'}
                                            </p>
                                            <div className="flex justify-between text-white/70 text-xs">
                                                <span>{form.cardHolder || 'TITULCARDULUI'}</span>
                                                <span>{form.expiry || 'MM/YY'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Spate */}
                                    <div
                                        className="absolute inset-0 rounded-2xl overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, #090979 0%, #020024 100%)',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <div className="h-10 bg-black/40 mt-6" />
                                        <div className="px-6 mt-4 flex items-center justify-end gap-3">
                                            <div className="flex-1 h-8 bg-white/20 rounded" />
                                            <div className="bg-white rounded px-3 py-1.5 font-mono font-bold text-gray-900 text-sm min-w-[50px] text-center">
                                                {form.cvv || '•••'}
                                            </div>
                                        </div>
                                        <p className="text-white/40 text-[10px] text-center mt-4">Apasă cardul pentru a-l întoarce</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Număr card" icon={<CreditCard size={15} />} error={errors.cardNumber} className="sm:col-span-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1234 5678 9012 3456"
                                        value={form.cardNumber}
                                        onChange={e => handleChange('cardNumber', e.target.value)}
                                        className={inputCls(!!errors.cardNumber) + ' font-mono tracking-widest'}
                                    />
                                </Field>
                                <Field label="Titular card" icon={<User size={15} />} error={errors.cardHolder} className="sm:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="ION POPESCU"
                                        value={form.cardHolder}
                                        onChange={e => handleChange('cardHolder', e.target.value.toUpperCase())}
                                        className={inputCls(!!errors.cardHolder) + ' uppercase tracking-widest'}
                                    />
                                </Field>
                                <Field label="Dată expirare" icon={<Calendar size={15} />} error={errors.expiry}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="MM/YY"
                                        value={form.expiry}
                                        onChange={e => handleChange('expiry', e.target.value)}
                                        className={inputCls(!!errors.expiry) + ' font-mono'}
                                    />
                                </Field>
                                <Field label="CVV" icon={<ShieldCheck size={15} />} error={errors.cvv}>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        placeholder="•••"
                                        value={form.cvv}
                                        onFocus={() => setFlipped(true)}
                                        onBlur={() => setFlipped(false)}
                                        onChange={e => handleChange('cvv', e.target.value)}
                                        className={inputCls(!!errors.cvv) + ' font-mono tracking-widest'}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-extrabold rounded-2xl text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Se procesează plata...
                                </>
                            ) : (
                                <>
                                    <Lock size={20} />
                                    Plătește {totalPrice} MDL
                                </>
                            )}
                        </button>
                    </form>

                    {/* ─── SUMAR COMANDĂ ─── */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Sumar Comandă</h2>
                            <div className="space-y-3 mb-4">
                                {items.map(item => {
                                    const price = item.discountPrice ?? item.price;
                                    return (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0">
                                                {price * item.quantity} MDL
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total</span>
                                    <span className="text-2xl font-extrabold text-[#00c6ff]">{totalPrice} MDL</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2 text-xs text-gray-400 dark:text-gray-500">
                                <div className="flex items-center gap-2"><Lock size={12} className="text-emerald-400" /> Plată 100% securizată</div>
                                <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-400" /> Criptare SSL 256-bit</div>
                                <div className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400" /> Confirmare imediată pe email</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Helper components ─── */
function Field({
                   label, icon, error, children, className = ''
               }: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <span className="text-[#00c6ff]">{icon}</span>{label}
            </label>
            {children}
            {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
        </div>
    );
}

function inputCls(hasError: boolean) {
    return [
        'w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border',
        'text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600',
        'focus:outline-none focus:ring-2 focus:ring-[#00c6ff]/50 transition-all duration-200',
        hasError
            ? 'border-red-400 focus:ring-red-400/40'
            : 'border-gray-200 dark:border-white/10 focus:border-[#00c6ff]',
    ].join(' ');
}
