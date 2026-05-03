import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, LogIn, Shield, KeyRound } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoLogin = trpc.demoAuth.login.useMutation({
    onSuccess: (data) => {
      // Store demo token in localStorage
      localStorage.setItem("demo_auth_token", data.token);
      localStorage.setItem("demo_user", JSON.stringify(data.user));
      window.location.href = "/admin";
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    demoLogin.mutate({ password });
  };

  // Check if OAuth is configured
  const hasOAuth = !!import.meta.env.VITE_KIMI_AUTH_URL;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-[#00c9a7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад на сайт
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#333] mb-1">
            Вход в админ-панель
          </h1>
          <p className="text-sm text-[#888]">
            ГБУЗ &quot;РОД&quot; ПАО
          </p>
        </div>

        {/* Demo Login */}
        <div className="bg-[#f5f5f5] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-[#00c9a7]" />
            <h2 className="text-sm font-semibold text-[#333]">
              Демо-вход (без OAuth)
            </h2>
          </div>

          <p className="text-xs text-[#888] mb-4">
            Для Railway-деплоя без настройки OAuth. Введите пароль{" "}
            <code className="bg-white px-1.5 py-0.5 rounded text-[#00c9a7] font-mono">
              rod-admin
            </code>{" "}
            или оставьте пустым.
          </p>

          <form onSubmit={handleDemoLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль (rod-admin)"
              className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-sm text-[#333] focus:border-[#00c9a7] focus:outline-none"
            />

            {error && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-gradient-accent text-white text-sm font-semibold hover:shadow-md transition-shadow disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти как администратор"}
            </button>
          </form>
        </div>

        {/* OAuth Login (only shown if configured) */}
        {hasOAuth && (
          <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
            <h2 className="text-sm font-semibold text-[#333] mb-4">
              Вход через Kimi OAuth
            </h2>

            <a
              href={`${import.meta.env.VITE_KIMI_AUTH_URL}?client_id=${import.meta.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/oauth/callback`)}&response_type=code&scope=profile`}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-[#333] text-white text-sm font-medium hover:bg-[#444] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Войти через Kimi
            </a>
          </div>
        )}

        {/* Info for developers */}
        {!hasOAuth && (
          <div className="mt-4 p-3 bg-[#00c9a7]/5 rounded-lg border border-[#00c9a7]/20">
            <p className="text-xs text-[#666]">
              <strong className="text-[#00c9a7]">OAuth не настроен.</strong>{" "}
              Для production-использования добавьте переменные{" "}
              <code className="font-mono text-[#00c9a7]">VITE_KIMI_AUTH_URL</code>,{" "}
              <code className="font-mono text-[#00c9a7]">VITE_APP_ID</code> в
              настройках Railway.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
