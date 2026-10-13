'use client';

import React, { useState } from 'react';
import { KeyRound, Mail, UserPlus, LogIn } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: { id: string; email: string; isAdmin: boolean }) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro no processamento.');
      }

      onSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-50 via-white to-orange-100/50 p-6 font-sans">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/25 mb-4">
            <KeyRound className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Resume Builder</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            {isLogin ? 'Faça login para gerenciar seu currículo' : 'Crie sua conta para começar do zero'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Error display */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs border border-red-100 px-4 py-3 rounded-lg font-medium leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">E-mail / Usuário</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="ex: admin"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white rounded-xl font-bold shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <span>Processando...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" /> Entrar
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Criar Conta
              </>
            )}
          </button>

        </form>

        {/* Footer / Toggle mode */}
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui uma conta? Faça Login'}
          </button>
        </div>

        {/* Admin Creds Hint */}
        {isLogin && (
          <div className="mt-6 bg-gray-50 border border-gray-200/60 p-4 rounded-xl text-center text-xs text-gray-500">
            <span className="font-bold text-gray-700">Conta Admin Pronta:</span>
            <div className="mt-1 flex justify-center gap-4">
              <span>Usuário: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">admin</code></span>
              <span>Senha: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">admin</code></span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
