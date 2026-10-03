'use client';

import { useState } from 'react';
import { LogIn, Sparkles, UserPlus } from 'lucide-react';
import { registerLocalAccount, signInLocalAccount, type LocalProfile } from './localAccounts';

type AuthMode = 'signin' | 'register';

export default function AuthScreen({ onAuthenticated }: { onAuthenticated: (profile: LocalProfile) => void }) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const registeredName = String(formData.get('name') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    setError('');
    setSubmitting(true);
    try {
      const profile = mode === 'register'
        ? await registerLocalAccount(registeredName, email, password)
        : await signInLocalAccount(email, password);
      onAuthenticated(profile);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to access local account data.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand"><div className="logo"><Sparkles size={18}/></div><div><strong>SmartTask</strong><span>Workspace</span></div></div>
      <h1 id="auth-title">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="auth-copy">Sign in or register to open your workspace.</p>
      <div className="auth-tabs" role="tablist" aria-label="Account access">
        <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => {setMode('signin');setError('')}}><LogIn size={16}/>Sign in</button>
        <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => {setMode('register');setError('')}}><UserPlus size={16}/>Register</button>
      </div>
      <form className="auth-form" onSubmit={event => void submit(event)}>
        {mode === 'register' && <label>Full name<input name="name" type="text" autoComplete="name" placeholder="Your name" required/></label>}
        <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required/></label>
        <label>Password<input name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" minLength={6} required/></label>
        {error&&<p className="auth-error" role="alert">{error}</p>}
        <button className="primary auth-submit" type="submit" disabled={submitting}>{mode === 'signin' ? <><LogIn size={17}/>{submitting?'Signing in...':'Sign in'}</> : <><UserPlus size={17}/>{submitting?'Creating account...':'Create account'}</>}</button>
      </form>
      <p className="auth-note">Accounts are stored in this browser only. This demo does not sync or provide production-grade authentication.</p>
    </section>
  </main>;
}