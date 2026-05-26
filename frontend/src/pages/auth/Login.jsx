import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { ParkingCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    await login(data.email, data.password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-navy-950 p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #3074FD 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #0236A0 0%, transparent 40%)`
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-500 shadow-lg">
              <ParkingCircle size={22} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold text-white tracking-tight">XWZ Parking</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Smart Parking.<br />
              <span className="text-navy-400">Zero Hassle.</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Manage your parking operations efficiently — track entries, exits, and revenue all in one place.
            </p>
          </div>
          <div className="flex gap-8 pt-4">
            {[
              { label: 'Parkings', value: 'Multi-lot' },
              { label: 'Billing', value: 'Auto' },
              { label: 'Reports', value: 'Real-time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{stat.label}</p>
                <p className="text-lg font-bold text-white mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[11px] text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} XWZ Ltd — All rights reserved
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-app-bg px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-500 shadow">
              <ParkingCircle size={18} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="text-base font-bold text-slate-900">XWZ Parking</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <>
                  <span className="spinner h-4 w-4" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-navy-500 hover:text-navy-600 transition-colors">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
