import { Link } from 'react-router-dom';
import {
  Info,
  Target,
  Workflow,
  Star,
  Layers,
  Rocket,
  ArrowRight,
  Droplets,
  Image as ImageIcon,
  ScanLine,
  SlidersHorizontal,
  Gauge,
  Database,
  LayoutDashboard,
  FileText,
  History,
  GitCompare,
  Bell,
  Cloud,
  Smartphone,
  Factory,
  FlaskConical,
  GraduationCap,
  Leaf,
  Activity,
  Wrench,
  TrendingUp,
  CloudRain,
  ArrowDown,
  Building2,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const OBJECTIVES = [
  { icon: Droplets, title: 'Monitor Wastewater Quality', desc: 'Track water quality indicators before and after filtration.' },
  { icon: History, title: 'Maintain Digital Records', desc: 'Keep permanent, searchable records of every filtration test.' },
  { icon: GitCompare, title: 'Compare Filtration Performance', desc: 'Measure improvement between before and after treatment.' },
  { icon: Wrench, title: 'Identify Maintenance Needs', desc: 'Detect filter clogging and performance degradation early.' },
  { icon: FileText, title: 'Generate Downloadable Reports', desc: 'Produce professional PDF reports for documentation.' },
  { icon: Target, title: 'Support Affordable Monitoring', desc: 'Low-cost solution accessible to small and medium industries.' },
];

const TIMELINE = [
  { icon: Factory, label: 'Textile Wastewater' },
  { icon: ImageIcon, label: 'Upload Sample Images' },
  { icon: ScanLine, label: 'Image Analysis' },
  { icon: SlidersHorizontal, label: 'Manual Parameter Entry' },
  { icon: Gauge, label: 'Performance Evaluation' },
  { icon: Database, label: 'Record Storage' },
  { icon: LayoutDashboard, label: 'Dashboard & Reports' },
];

const FEATURES = [
  { icon: ScanLine, title: 'Image-Based Sample Analysis', desc: 'pH, water colour, dye category and microfiber estimation from photos.' },
  { icon: History, title: 'Historical Record Management', desc: 'Centralized, searchable storage of every test with full metadata.' },
  { icon: GitCompare, title: 'Before vs After Comparison', desc: 'Side-by-side parameter comparison with bar and radar charts.' },
  { icon: Bell, title: 'Maintenance Alerts', desc: 'Automatic coloured alerts for clogging, quality and performance.' },
  { icon: LayoutDashboard, title: 'Interactive Dashboard', desc: 'Live averages, distributions, recent alerts and activity.' },
  { icon: FileText, title: 'Report Generation', desc: 'Downloadable PDF reports with images, results and charts.' },
  { icon: Cloud, title: 'Cloud Data Storage', desc: 'Secure, persistent cloud storage backed by Supabase.' },
  { icon: Smartphone, title: 'Responsive User Interface', desc: 'Optimized across desktop, tablet and mobile devices.' },
];

const APPLICATIONS = [
  { icon: FlaskConical, title: 'Textile Dyeing Units' },
  { icon: Factory, title: 'Textile Processing Industries' },
  { icon: Building2, title: 'Small & Medium Enterprises' },
  { icon: FlaskConical, title: 'Research Laboratories' },
  { icon: GraduationCap, title: 'Academic Institutions' },
  { icon: Leaf, title: 'Environmental Monitoring' },
];

const FUTURE = [
  { icon: Smartphone, title: 'Mobile Application' },
  { icon: Droplets, title: 'Additional Water Quality Parameters' },
  { icon: Factory, title: 'Industrial Deployment' },
  { icon: CloudRain, title: 'Cloud Analytics' },
  { icon: Wrench, title: 'Predictive Maintenance' },
  { icon: Activity, title: 'Advanced Performance Monitoring' },
];

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: typeof Info;
  title: string;
  desc?: string;
}) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glass-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-display text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        {desc && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <GlassCard strong className="relative overflow-hidden p-8 lg:p-12">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-aqua-400/20 blur-3xl" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-300/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-5">
              <Info className="h-3.5 w-3.5" /> About the Project
            </div>
            <h1 className="font-display text-2xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
              Smart Textile Water Filtration{' '}
              <span className="bg-gradient-to-r from-brand-500 to-aqua-500 bg-clip-text text-transparent">
                Monitoring System
              </span>
            </h1>
            <p className="mt-4 text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A digital monitoring platform designed to support textile wastewater filtration by combining
              image-based sample assessment, operational parameter monitoring, historical record management, and
              performance comparison within a single web application.
            </p>
          </div>
          {/* Illustration placeholder */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative h-72 w-72">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/15 to-aqua-500/10 border border-brand-200/40 dark:border-brand-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="flex items-center justify-center h-28 w-28 rounded-3xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow animate-float">
                    <Droplets className="h-14 w-14" />
                  </div>
                  <div className="absolute -top-6 -right-6 p-2.5 rounded-2xl glass-strong text-brand-500 animate-fade-in">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-4 -left-6 p-2.5 rounded-2xl glass-strong text-emerald-500 animate-fade-in">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div className="absolute top-1/2 -left-10 p-2 rounded-xl glass text-aqua-500">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-300/20 animate-pulse-ring" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Project overview */}
      <section>
        <SectionTitle icon={Info} title="Project Overview" />
        <GlassCard className="p-6 lg:p-8">
          <div className="space-y-4 text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Textile industries generate large volumes of wastewater containing dyes, suspended particles, and
              microfiber pollutants. Monitoring filtration efficiency is often expensive and difficult for small
              and medium-scale industries.
            </p>
            <p>
              This platform provides a centralized solution for recording filtration data, monitoring water quality
              indicators, comparing filtration performance before and after treatment, and maintaining digital
              records for reporting and future analysis.
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Objectives */}
      <section>
        <SectionTitle icon={Target} title="Objectives" desc="What this platform aims to achieve." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {OBJECTIVES.map((o) => {
            const Icon = o.icon;
            return (
              <GlassCard key={o.title} className="p-5" hover>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2.5 rounded-xl bg-brand-100/60 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{o.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{o.desc}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How it works — timeline */}
      <section>
        <SectionTitle icon={Workflow} title="How It Works" desc="End-to-end monitoring workflow." />
        <GlassCard className="p-6 lg:p-8">
          {/* Horizontal timeline (desktop) */}
          <div className="hidden lg:flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-center gap-2 w-28">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500/15 to-aqua-500/10 border border-brand-300/40 dark:border-brand-500/20 text-brand-600 dark:text-brand-300 transition-transform hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-brand-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          {/* Vertical timeline (mobile) */}
          <div className="lg:hidden space-y-1">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500/15 to-aqua-500/10 border border-brand-300/40 dark:border-brand-500/20 text-brand-600 dark:text-brand-300 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{step.label}</span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-brand-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      {/* Key features */}
      <section>
        <SectionTitle icon={Star} title="Key Features" desc="Core capabilities of the platform." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} className="p-5" hover>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500/15 to-aqua-500/10 text-brand-600 dark:text-brand-300 inline-flex mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{f.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Applications */}
      <section>
        <SectionTitle icon={Layers} title="Applications" desc="Where this platform can be used." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {APPLICATIONS.map((a) => {
            const Icon = a.icon;
            return (
              <GlassCard key={a.title} className="p-5 flex items-center gap-3" hover>
                <div className="shrink-0 p-2.5 rounded-xl bg-aqua-100/60 dark:bg-aqua-500/15 text-aqua-600 dark:text-aqua-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white text-sm">{a.title}</span>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Future scope */}
      <section>
        <SectionTitle icon={Rocket} title="Future Scope" desc="Planned enhancements and extensions." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {FUTURE.map((f) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} className="p-5" hover>
                <div className="flex items-center gap-3">
                  <div className="shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-violet-500/15 to-brand-500/10 text-violet-600 dark:text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-white text-sm">{f.title}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section>
        <GlassCard strong className="relative overflow-hidden p-8 lg:p-12 text-center">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-aqua-400/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow mb-5 animate-float">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
              Ready to Improve Textile Water Monitoring?
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Start a new filtration test now and let the platform analyse, record, and report your sample.
            </p>
            <Link
              to="/new-test"
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold shadow-glass hover:shadow-glow transition-all hover:-translate-y-0.5"
            >
              <FlaskConical className="h-5 w-5" /> Start New Test
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
