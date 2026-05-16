// Auth — Supabase auth context, login modal, auth button

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState('viewer');
  const [loading, setLoading] = React.useState(true);
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    window.sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = window.sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole('viewer');
        setLoading(false);
        window._isEditor = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchRole(userId) {
    const { data } = await window.sb.from('profiles').select('role').eq('id', userId).single();
    const r = data?.role || 'viewer';
    setRole(r);
    setLoading(false);
    window._isEditor = r === 'editor' || r === 'admin';
  }

  async function signIn(email, password) {
    const { error } = await window.sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await window.sb.auth.signOut();
  }

  const isEditor = role === 'editor' || role === 'admin';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ user, role, isEditor, isAdmin, loading, signIn, signOut, showLogin, setShowLogin }}>
      {children}
      {showLogin && <LoginModal />}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

function LoginModal() {
  const { signIn, setShowLogin } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await signIn(email, password);
      setShowLogin(false);
    } catch (e) {
      setErr(e.message || 'Falha na autenticação');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={() => setShowLogin(false)}>
      <div className="modal-box" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Arquivo · Acesso Restrito</div>
          <h2 className="modal-title">Identificação do Arquivista</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">E-mail</label>
              <input
                className="modal-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="arquivista@valiran.mundo"
                autoFocus
                required
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Senha</label>
              <input
                className="modal-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={() => setShowLogin(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={busy}>
              {busy ? 'Verificando…' : 'Entrar no Arquivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AuthButton() {
  const { user, role, loading, signOut, setShowLogin } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <button
        className="auth-btn"
        title="Entrar no Arquivo"
        onClick={() => setShowLogin(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginRight: 5 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Entrar
      </button>
    );
  }

  return (
    <div className="auth-user-wrap">
      <span className="auth-role-badge">{role}</span>
      <button
        className="auth-btn"
        title="Sair do Arquivo"
        onClick={signOut}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginRight: 5 }}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sair
      </button>
    </div>
  );
}

window.AuthProvider = AuthProvider;
window.useAuth = useAuth;
window.LoginModal = LoginModal;
window.AuthButton = AuthButton;
