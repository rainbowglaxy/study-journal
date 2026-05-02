import { useState } from 'react';
import { supabase } from '../supabaseClient';

const S = {
  bg: "#0f0e17",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
  muted: "#555",
  text: "#c4c4d4",
  accent: "#e53170",
  mono: "'DM Mono', monospace",
  serif: "'Noto Serif SC', Georgia, serif",
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // 注册
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('注册成功！请检查您的邮箱以验证账户。');
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: S.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: S.serif,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'DM Mono', monospace;
        }
        .auth-input:focus {
          border-color: rgba(229,49,112,0.6);
        }
        .auth-btn {
          background: #e53170;
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Mono', monospace;
          width: 100%;
        }
        .auth-btn:hover {
          background: #ff2965;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(229,49,112,0.3);
        }
        .auth-btn:disabled {
          opacity: 0.35;
          transform: none;
          cursor: not-allowed;
        }
        .auth-link {
          color: #e53170;
          cursor: pointer;
          text-decoration: none;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: S.card,
        border: `1px solid ${S.cardBorder}`,
        borderRadius: "12px",
        padding: "40px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: S.accent,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            margin: "0 auto 16px",
          }}>
            📓
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
            学习日志
          </h1>
          <p style={{ color: S.muted, fontSize: "14px" }}>
            {isLogin ? '登录您的账户' : '创建新账户'}
          </p>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "20px",
            color: "#ef4444",
            fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "20px",
            color: "#10b981",
            fontSize: "13px",
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "11px",
              color: S.muted,
              marginBottom: "8px",
              letterSpacing: "1.5px",
              fontFamily: S.mono,
              textTransform: "uppercase",
            }}>
              邮箱
            </label>
            <input
              type="email"
              className="auth-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "11px",
              color: S.muted,
              marginBottom: "8px",
              letterSpacing: "1.5px",
              fontFamily: S.mono,
              textTransform: "uppercase",
            }}>
              密码
            </label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: S.muted,
        }}>
          {isLogin ? '还没有账户？' : '已有账户？'}
          <span
            className="auth-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{ marginLeft: "8px" }}
          >
            {isLogin ? '立即注册' : '立即登录'}
          </span>
        </div>
      </div>
    </div>
  );
}
