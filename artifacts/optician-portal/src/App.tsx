/**
 * Copyright (c) 2026 Zeno Productions. All rights reserved.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Eye, FileText, LogOut, Mail, MapPin, Phone, Search, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import {
  Route,
  Switch,
  useParams,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Patient = {
  id: string; fullName: string; dateOfBirth: string; phone: string; email: string;
  address: string; lastFourSsn: string; patientSince: string; lastVisit: string;
  nextAppointment: string; insurance: string;
  prescriptions: { eye: string; od: string; os: string; add: string; examDate: string };
  visitHistory: { date: string; type: string; note: string }[];
};

const patients: Patient[] = [
  { id:'DEMO-1042',fullName:'Eleanor Whitaker',dateOfBirth:'08 / 14 / 1968',phone:'(555) 014-2286',email:'eleanor.whitaker@example.test',address:'1847 Laurel Row, Portland, OR 97205',lastFourSsn:'1842',patientSince:'April 2018',lastVisit:'February 12, 2025',nextAppointment:'May 28, 2025 · 10:30 AM',insurance:'Northstar Vision · Plus',prescriptions:{eye:'Progressive · distance',od:'−2.25 / −0.75 × 090',os:'−1.75 / −0.50 × 085',add:'+2.00',examDate:'February 12, 2025'},visitHistory:[{date:'Feb 12, 2025',type:'Comprehensive eye exam',note:'Updated progressive prescription. Reports occasional evening eye strain.'},{date:'Aug 03, 2024',type:'Frame adjustment',note:'Nose pads replaced; fit checked and adjusted.'},{date:'Feb 06, 2024',type:'Comprehensive eye exam',note:'Prescription stable. Discussed lens coating options.'}] },
  { id:'DEMO-2087',fullName:'Malcolm Reyes',dateOfBirth:'11 / 02 / 1982',phone:'(555) 019-7341',email:'malcolm.reyes@example.test',address:'22 Alder Street, Portland, OR 97209',lastFourSsn:'6307',patientSince:'September 2020',lastVisit:'March 04, 2025',nextAppointment:'June 10, 2025 · 2:15 PM',insurance:'Evergreen Optical · Select',prescriptions:{eye:'Single vision · distance',od:'−1.50 / −0.25 × 175',os:'−1.25 / −0.50 × 010',add:'—',examDate:'March 04, 2025'},visitHistory:[{date:'Mar 04, 2025',type:'Comprehensive eye exam',note:'Mild update to distance prescription. No concerns reported.'},{date:'Sep 21, 2024',type:'Contact lens follow-up',note:'Comfort and fit reviewed; trial lenses dispensed.'},{date:'Mar 02, 2024',type:'Comprehensive eye exam',note:'Routine exam. Healthy ocular findings.'}] },
  { id:'DEMO-3156',fullName:'June Park',dateOfBirth:'04 / 27 / 1991',phone:'(555) 012-9064',email:'june.park@example.test',address:'509 NE Everett Street, Portland, OR 97232',lastFourSsn:'2719',patientSince:'January 2022',lastVisit:'January 19, 2025',nextAppointment:'July 02, 2025 · 9:00 AM',insurance:'Cascade Care · Vision',prescriptions:{eye:'Single vision · near',od:'−0.25 / −0.25 × 080',os:'Plano / −0.25 × 095',add:'+0.75',examDate:'January 19, 2025'},visitHistory:[{date:'Jan 19, 2025',type:'Comprehensive eye exam',note:'Near-work fatigue discussed. Low add recommended for screen use.'},{date:'Jul 11, 2024',type:'Frame selection',note:'Selected lightweight acetate frame; lenses ordered.'},{date:'Jan 14, 2024',type:'Comprehensive eye exam',note:'Routine exam and updated visual needs.'}] },
  { id:'DEMO-4273',fullName:'Arthur Bellamy',dateOfBirth:'06 / 09 / 1954',phone:'(555) 018-4130',email:'arthur.bellamy@example.test',address:'73 Willow Court, Beaverton, OR 97005',lastFourSsn:'9051',patientSince:'June 2016',lastVisit:'December 16, 2024',nextAppointment:'June 16, 2025 · 11:45 AM',insurance:'Northstar Vision · Plus',prescriptions:{eye:'Progressive · all-purpose',od:'+1.25 / −0.50 × 105',os:'+1.50 / −0.75 × 080',add:'+2.50',examDate:'December 16, 2024'},visitHistory:[{date:'Dec 16, 2024',type:'Comprehensive eye exam',note:'Prescription renewed. Annual follow-up recommended.'},{date:'Jun 08, 2024',type:'Frame adjustment',note:'Temple alignment checked and adjusted.'},{date:'Dec 11, 2023',type:'Comprehensive eye exam',note:'Stable vision; discussed updated progressive lenses.'}] },
  { id:'DEMO-5390',fullName:'Sofia Lind',dateOfBirth:'02 / 18 / 1976',phone:'(555) 016-5902',email:'sofia.lind@example.test',address:'3114 SE Division Street, Portland, OR 97202',lastFourSsn:'4426',patientSince:'October 2019',lastVisit:'April 02, 2025',nextAppointment:'October 01, 2025 · 3:00 PM',insurance:'Juniper Vision · Standard',prescriptions:{eye:'Single vision · distance',od:'−3.00 / −0.50 × 160',os:'−2.75 / −0.75 × 020',add:'—',examDate:'April 02, 2025'},visitHistory:[{date:'Apr 02, 2025',type:'Comprehensive eye exam',note:'Prescription updated slightly. New lenses discussed.'},{date:'Oct 18, 2024',type:'Optical dispensing',note:'New frame fitted and adjusted for comfort.'},{date:'Apr 08, 2024',type:'Comprehensive eye exam',note:'Routine exam; ocular health within expected range.'}] },
];

function Brand({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-3"><div className={`brand-mark ${light ? '!bg-[#d9c59d] !text-[#24483f]' : ''}`}><Eye size={19} strokeWidth={1.8}/></div><div><div className={`brand-name ${light ? 'text-[#fbf8ef]' : 'text-[#29483f]'}`}>Stillwater Optical</div><div className={`brand-sub ${light ? '!text-[#c3d0c8]' : ''}`}>Practice workspace</div></div></div>;
}

function Login({ onSignIn }: { onSignIn: () => void }) {
  return <main className="login-layout">
    <section className="login-art">
      <Brand light />
      <div className="login-quote fade-in">
        <p className="eyebrow !text-[#d5bd91] mb-5">A clearer view of every visit</p>
        <h1 className="login-title">Good care<br/>starts with <em>knowing.</em></h1>
        <p className="login-note mt-7">A considered workspace for the people who keep an independent practice in focus.</p>
      </div>
      <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#bdcbc3]"><ShieldCheck size={15}/> A private demo with fictional sample records</div>
    </section>
    <section className="login-panel">
      <div className="login-card fade-in">
        <p className="eyebrow mb-3">Welcome to the front desk</p>
        <h2 className="font-display text-[36px] leading-tight tracking-[-.04em] text-[#29483f]">Your day, in focus.</h2>
        <p className="mt-3 text-sm leading-6 text-[#75837d]">Step into the sample practice workspace. No account or password needed.</p>
        <div className="mt-8 rounded-xl border border-[#e5dfd2] bg-[#fbfaf6] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-[#e8eee8] text-[#446b5d]"><Sparkles size={16}/></div>
            <div><div className="text-sm font-semibold text-[#315248]">Demo access</div><div className="mt-1 text-xs leading-5 text-[#7a8780]">Explore sample patient profiles and visit details.</div></div>
          </div>
          <button type="button" onClick={onSignIn} className="button-primary mt-5 w-full" data-testid="button-demo-sign-in">Enter demo workspace <ArrowRight size={15}/></button>
        </div>
        <div className="mt-7 border-t border-[#e5dfd2] pt-5 text-[11px] leading-5 text-[#87928c]">This prototype uses fictional records only. No real patient information is connected or stored.</div>
      </div>
    </section>
  </main>;
}

function Header({ onSignOut, onHome }: { onSignOut: () => void; onHome: () => void }) {
  return <header className="topbar">
    <button onClick={onHome} className="text-left" aria-label="Go to patient search" data-testid="link-home"><Brand/></button>
    <div className="flex items-center gap-5">
      <div className="hidden items-center gap-2 text-xs text-[#74827b] sm:flex"><span className="h-2 w-2 rounded-full bg-[#79a58c]"/> Demo workspace</div>
      <button onClick={onSignOut} className="button-quiet" data-testid="button-sign-out"><LogOut size={14}/> <span className="hidden sm:inline">Sign out</span></button>
    </div>
  </header>;
}

function SearchPage({ onSignOut, onHome }: { onSignOut: () => void; onHome: () => void }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    const digits = q.replace(/\D/g, '');
    return patients.filter((p) => p.fullName.toLowerCase().includes(q) || (digits.length > 0 && digits.length <= 4 && p.lastFourSsn.includes(digits))).sort((a,b)=>a.fullName.localeCompare(b.fullName));
  }, [query]);
  const [, setLocation] = useLocation();
  return <div className="app-shell"><Header onSignOut={onSignOut} onHome={onHome}/><main className="main-wrap fade-in">
    <div className="mb-9 flex items-end justify-between gap-5">
      <div><p className="eyebrow mb-3">Patient directory <span className="mx-2 text-[#c6a56d]">/</span> Sample records</p><h1 className="page-title">Find your patient.</h1><p className="mt-3 text-sm text-[#74827b]">A familiar name or the last four digits is all you need.</p></div>
      <div className="hidden rounded-full border border-[#ded8ca] bg-[#fbfaf6] px-3 py-2 text-[11px] text-[#708077] md:block">{patients.length} fictional records</div>
    </div>
    <div className="search-box"><Search size={19} className="search-icon"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by name or last four SSN digits" aria-label="Search patients by name or last four SSN digits" data-testid="input-patient-search"/>{query ? <button type="button" className="absolute right-4 rounded px-2 py-1 text-xs text-[#71817b] hover:bg-[#f0eee6]" onClick={()=>setQuery('')} data-testid="button-clear-search">Clear</button> : <span className="key-hint">Search</span>}</div>
    <div className="mt-8 flex items-center justify-between"><h2 className="section-label">{query ? `${filtered.length} matching ${filtered.length === 1 ? 'record' : 'records'}` : 'Recently viewed'}</h2><span className="text-[11px] text-[#89938e]">Sorted by name</span></div>
    <section className="card mt-3 overflow-hidden" aria-label="Patient search results">
      {filtered.length ? filtered.map((patient) => <button type="button" key={patient.id} className="result-row w-full text-left" onClick={()=>setLocation(`/patients/${patient.id}`)} data-testid={`result-patient-${patient.id}`}>
        <div className="flex min-w-0 items-center gap-4"><div className="avatar">{patient.fullName.split(' ').map(part=>part[0]).slice(0,2).join('')}</div><div className="min-w-0"><div className="font-semibold text-[#29483f]">{patient.fullName}</div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#819088]"><span>DOB {patient.dateOfBirth}</span><span className="hidden sm:inline">Patient since {patient.patientSince}</span></div></div></div>
        <div className="flex shrink-0 items-center gap-4"><div className="hidden text-right sm:block"><div className="text-xs font-medium text-[#4a665b]">SSN ending {patient.lastFourSsn}</div><div className="mt-1 text-[11px] text-[#87928c]">Last visit {patient.lastVisit}</div></div><ChevronRight size={17} className="text-[#9aa39c]"/></div>
      </button>) : <div className="px-7 py-14 text-center" data-testid="status-no-results"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf0e9] text-[#668276]"><Search size={19}/></div><h3 className="mt-4 font-display text-2xl text-[#315248]">No match just yet</h3><p className="mt-2 text-sm text-[#819088]">Try a different spelling or the last four digits.</p><button onClick={()=>setQuery('')} className="button-quiet mt-5">Clear search</button></div>}
    </section>
    <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#89938e]"><ShieldCheck size={14} className="mt-0.5 shrink-0"/> Sample environment · All patient details shown are fictional and for demonstration only.</div>
  </main></div>;
}

function PatientProfile({ onSignOut, onHome }: { onSignOut: () => void; onHome: () => void }) {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((record) => record.id === id);
  const [, setLocation] = useLocation();
  if (!patient) return <div className="app-shell"><Header onSignOut={onSignOut} onHome={onHome}/><main className="main-wrap"><button onClick={()=>setLocation('/')} className="button-quiet"><ArrowLeft size={15}/> Back to search</button><section className="card mt-8 p-9 text-center"><h1 className="font-display text-3xl text-[#29483f]">Record not found</h1><p className="mt-2 text-sm text-[#7d8a83]">This sample patient is not in the directory.</p></section></main></div>;
  return <div className="app-shell"><Header onSignOut={onSignOut} onHome={onHome}/><main className="main-wrap fade-in">
    <button onClick={()=>setLocation('/')} className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#577166] transition hover:text-[#24483f]" data-testid="button-back-to-search"><ArrowLeft size={15}/> Back to patient search</button>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div><div className="eyebrow mb-3">Patient profile <span className="mx-2 text-[#c6a56d]">/</span> {patient.id}</div><div className="flex items-center gap-4"><div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#dce8e1] font-display text-xl text-[#325c50]">{patient.fullName.split(' ').map(part=>part[0]).slice(0,2).join('')}</div><div><h1 className="page-title !text-[clamp(34px,4vw,48px)]" data-testid="text-patient-name">{patient.fullName}</h1><p className="mt-2 text-xs text-[#7d8a83]">Patient since {patient.patientSince} <span className="mx-2 text-[#c6a56d]">·</span> SSN ending {patient.lastFourSsn}</p></div></div></div>
      <div className="tag"><span className="h-1.5 w-1.5 rounded-full bg-[#6e9a7d]"/> Sample record</div>
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-5">
        <section className="card p-6 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="section-label">Contact details</h2><UserRound size={17} className="text-[#9a9f93]"/></div>
          <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
            <Detail icon={<CalendarDays size={15}/>} label="Date of birth" value={patient.dateOfBirth}/>
            <Detail icon={<Phone size={15}/>} label="Phone" value={patient.phone}/>
            <Detail icon={<Mail size={15}/>} label="Email" value={patient.email}/>
            <Detail icon={<MapPin size={15}/>} label="Address" value={patient.address}/>
          </div>
        </section>
        <section className="card p-6 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="section-label">Prescription on file</h2><span className="tag"><Eye size={12}/>{patient.prescriptions.eye}</span></div>
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-lg bg-[#f3f1e9] px-4 py-4">
            <div><div className="text-[10px] font-bold tracking-[.12em] text-[#87928c]">OD · RIGHT</div><div className="mt-2 text-sm font-semibold text-[#315248]">{patient.prescriptions.od}</div></div>
            <div><div className="text-[10px] font-bold tracking-[.12em] text-[#87928c]">OS · LEFT</div><div className="mt-2 text-sm font-semibold text-[#315248]">{patient.prescriptions.os}</div></div>
            <div><div className="text-[10px] font-bold tracking-[.12em] text-[#87928c]">ADD</div><div className="mt-2 text-sm font-semibold text-[#315248]">{patient.prescriptions.add}</div></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#7c8982]"><FileText size={14}/> Exam date <span className="font-semibold text-[#49645a]">{patient.prescriptions.examDate}</span></div>
        </section>
        <section className="card p-6 sm:p-7">
          <div className="mb-2 flex items-center justify-between"><h2 className="section-label">Visit history</h2><span className="text-xs text-[#8a958e]">Most recent first</span></div>
          <div>{patient.visitHistory.map((visit,index)=><div className="relative flex gap-4 py-4" key={`${visit.date}-${visit.type}`} data-testid={`visit-${patient.id}-${index}`}>
            <div className="relative flex w-5 shrink-0 justify-center"><span className="mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#84a08f] bg-[#fbfaf6]"/>{index < patient.visitHistory.length-1 && <span className="absolute top-5 bottom-[-8px] w-px bg-[#e2e4da]"/>}</div>
            <div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-sm font-semibold text-[#35564a]">{visit.type}</span><span className="text-[11px] text-[#8c9690]">{visit.date}</span></div><p className="mt-1 text-xs leading-5 text-[#7c8982]">{visit.note}</p></div>
          </div>)}</div>
        </section>
      </div>
      <aside className="space-y-5">
        <section className="card overflow-hidden">
          <div className="bg-[#285247] px-6 py-5 text-[#f6f3ea]"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#c4d2c7]"><Clock3 size={14}/> Next appointment</div><div className="mt-3 font-display text-[25px] leading-tight">{patient.nextAppointment.split(' · ')[0]}</div><div className="mt-1 text-sm text-[#d1ddd5]">{patient.nextAppointment.split(' · ')[1]}</div></div>
          <div className="flex items-center justify-between px-6 py-4"><span className="text-xs text-[#7d8a83]">Previous visit</span><span className="text-xs font-semibold text-[#48655a]">{patient.lastVisit}</span></div>
        </section>
        <section className="card p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="section-label">Vision coverage</h2><ShieldCheck size={16} className="text-[#6f927d]"/></div><div className="mt-5 font-display text-2xl text-[#315248]">{patient.insurance.split(' · ')[0]}</div><div className="mt-2 flex items-center justify-between border-t border-[#ece8df] pt-4"><span className="text-xs text-[#829088]">Plan</span><span className="tag">{patient.insurance.split(' · ')[1]}</span></div><div className="mt-4 flex items-center gap-2 text-[11px] text-[#89938e]"><Check size={13}/> Sample coverage details</div></section>
        <div className="rounded-xl border border-[#e4ddcf] bg-[#f0eee5] p-5"><div className="flex items-center gap-2 text-xs font-semibold text-[#536e62]"><Sparkles size={14}/> Quick context</div><p className="mt-2 text-xs leading-5 text-[#7d8982]">Last seen {patient.lastVisit}. Prescription and visit notes are included here as fictional demo information.</p></div>
      </aside>
    </div>
    <div className="mt-7 flex items-start gap-2 text-[11px] leading-5 text-[#89938e]"><ShieldCheck size={14} className="mt-0.5 shrink-0"/> Fictional demo record · This prototype is not connected to a live patient system.</div>
  </main></div>;
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="detail-cell"><div className="mb-2 flex items-center gap-2 text-[#87928c]">{icon}<span className="detail-label !mb-0">{label}</span></div><div className="detail-value break-words">{value}</div></div>;
}

function Router() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [, setLocation] = useLocation();
  const signOut = () => { setIsSignedIn(false); setLocation('/login'); };
  const goHome = () => setLocation('/');
  const login = () => { setIsSignedIn(true); setLocation('/'); };
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/login">{() => <Login onSignIn={login}/>}</Route>
        <Route path="/">{() => isSignedIn ? <SearchPage onSignOut={signOut} onHome={goHome}/> : <Login onSignIn={login}/>}</Route>
        <Route path="/patients/:id">{() => isSignedIn ? <PatientProfile onSignOut={signOut} onHome={goHome}/> : <Login onSignIn={login}/>}</Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
