import { useState, type FormEvent } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Send,
  GraduationCap,
  Briefcase,
  ChevronDown,
  HelpCircle,
  User,
  MessageSquare,
  Droplets,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { useToast } from '@/context/ToastContext';

const CONTACT_INFO = [
  { icon: Droplets, label: 'Project Name', value: 'Smart Textile Water Filtration Monitoring System' },
  { icon: Building2, label: 'Organization', value: 'Thiagarajar College of Engineering' },
  { icon: GraduationCap, label: 'Department', value: 'Mechatronics Engineering' },
  { icon: Mail, label: 'Email', value: 'rajhee@student.tce.edu', href: 'mailto:rajhee@student.tce.edu' },
  { icon: Phone, label: 'Phone', value: '+91 9994438481', href: 'tel:+919994438481' },
  { icon: MapPin, label: 'Location', value: 'Madurai, Tamil Nadu, India' },
];

const FAQS = [
  {
    q: 'What is this platform used for?',
    a: 'It is a digital monitoring platform for textile wastewater filtration. It combines image-based sample assessment, operational parameter monitoring, historical record management, and before vs after performance comparison in a single web application.',
  },
  {
    q: 'Can it be used by textile industries?',
    a: 'Yes. The platform is designed for textile dyeing units, processing industries, and small & medium enterprises. It provides an affordable, centralized way to monitor filtration efficiency and maintain digital records.',
  },
  {
    q: 'Does it support historical records?',
    a: 'Yes. Every test is stored permanently in a cloud database with full metadata — sample ID, date, time, images, estimated values, manual readings, and alerts. Records can be searched, viewed, edited, exported, and compared at any time.',
  },
  {
    q: 'Can reports be downloaded?',
    a: 'Yes. The platform generates downloadable PDF reports for individual records and for before vs after comparisons. Reports include sample details, uploaded images, results, charts, alerts, date and time.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl glass overflow-hidden transition-all">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-white">
          <HelpCircle className="h-4 w-4 text-brand-500 shrink-0" />
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 pl-12 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('error', 'Please fill in your name, email, and message.');
      return;
    }
    setSending(true);
    // Simulated submission — no backend required for a contact form.
    window.setTimeout(() => {
      setSending(false);
      showToast('success', 'Your message has been sent. We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', organization: '', subject: '', message: '' });
    }, 900);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-300/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4">
          <Phone className="h-3.5 w-3.5" /> Contact Us
        </div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
          Get in Touch
        </h1>
        <p className="mt-3 text-sm lg:text-base text-slate-600 dark:text-slate-300">
          We welcome your feedback, suggestions, and collaboration opportunities.
        </p>
      </div>

      {/* Contact info + form */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: info */}
        <GlassCard strong className="p-6 lg:p-8">
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-1">
            Project Information
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Reach out using the details below.
          </p>
          <div className="space-y-4">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-3.5 group">
                  <div className="shrink-0 p-3 rounded-xl bg-gradient-to-br from-brand-500/15 to-aqua-500/10 text-brand-600 dark:text-brand-300 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5 break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} className="block hover:opacity-80 transition-opacity">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>

          {/* Decorative map-ish panel */}
          <div className="mt-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-aqua-500/5 border border-brand-200/40 dark:border-brand-500/20 p-5 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-brand-500 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Located in <span className="font-semibold text-slate-800 dark:text-white">Madurai, Tamil Nadu, India</span>
            </p>
          </div>
        </GlassCard>

        {/* Right: form */}
        <GlassCard className="p-6 lg:p-8">
          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white mb-1">
            Send a Message
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Fill out the form and we will respond shortly.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                placeholder="Your name"
                icon={<User className="h-4 w-4" />}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
              <Field
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Phone Number"
                type="tel"
                placeholder="+91 ..."
                icon={<Phone className="h-4 w-4" />}
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
              <Field
                label="Organization"
                placeholder="Your organization"
                icon={<Briefcase className="h-4 w-4" />}
                value={form.organization}
                onChange={(e) => update('organization', e.target.value)}
              />
            </div>
            <Field
              label="Subject"
              placeholder="Message subject"
              icon={<MessageSquare className="h-4 w-4" />}
              value={form.subject}
              onChange={(e) => update('subject', e.target.value)}
            />
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Message</span>
              <textarea
                rows={4}
                placeholder="Write your message here…"
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                required
                className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60 transition-all resize-y"
              />
            </label>
            <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto" leftIcon={!sending ? <Send className="h-4 w-4" /> : undefined}>
              Send Message
            </Button>
          </form>
        </GlassCard>
      </div>

      {/* FAQ */}
      <section>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-300/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" /> FAQ
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
