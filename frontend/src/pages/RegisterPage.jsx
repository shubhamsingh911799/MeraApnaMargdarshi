import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      setSubmitting(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setSubmitting(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    const response = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-sm text-sky-300">MeraApnaMargdarshi</p>
        <h1 className="mt-2 text-3xl font-bold">Your Personal Guide for Health, Wealth & Growth</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm">Full Name</label>
            <input name="name" type="text" required className="w-full rounded-xl bg-slate-900 px-4 py-3" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl bg-slate-900 px-4 py-3" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl bg-slate-900 px-4 py-3" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Confirm Password</label>
            <input name="confirmPassword" type="password" required className="w-full rounded-xl bg-slate-900 px-4 py-3" value={form.confirmPassword} onChange={handleChange} />
          </div>
          {error ? <div className="rounded-xl bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-slate-950">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
