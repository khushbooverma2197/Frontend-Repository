// Auth service — NO direct Supabase connection from the browser.
// All auth calls are proxied through the backend (Render) which can reach Supabase freely.
// Sessions are stored in localStorage and decoded locally — zero outbound connections to supabase.co.

const backendUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '');
const STORAGE_KEY = 'sb_session';

// ─── JWT helpers (local, no network) ──────────────────────────────────────────

const decodeJwt = (token) => {
  try {
    const parts = token?.split('.') || [];
    if (parts.length < 2) return null;
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp;
};

const userFromSession = (session, backendUser) => {
  if (backendUser) return backendUser;
  const payload = decodeJwt(session?.access_token);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    user_metadata: payload.user_metadata || {},
    role: payload.role,
  };
};

// ─── localStorage helpers ──────────────────────────────────────────────────────

const loadSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('authToken');
  }
};

// ─── In-memory pub/sub (replaces Supabase websocket subscription) ─────────────

const listeners = new Set();

const notify = (event, session) => {
  listeners.forEach((cb) => cb(event, session));
};

export const onAuthStateChange = (callback) => {
  listeners.add(callback);
  return {
    data: {
      subscription: {
        unsubscribe: () => listeners.delete(callback),
      },
    },
  };
};

// ─── Compatibility stubs ───────────────────────────────────────────────────────

export const isAuthConfigured = () => true;
export const isUsingServiceRoleKey = () => false;
export const getAuthConfigMeta = () => ({});
export const checkSupabaseConnection = async () => ({ ok: true, reason: 'proxied' });

// ─── Session restore (reads localStorage, no network) ─────────────────────────

export const getAuthSession = async () => {
  const session = loadSession();
  if (!session?.access_token) return { data: { session: null }, error: null };

  if (isTokenExpired(session.access_token)) {
    persistSession(null);
    return { data: { session: null }, error: null };
  }

  const user = userFromSession(session, session.user);
  return { data: { session: { ...session, user } }, error: null };
};

// ─── Signup — proxied through backend ────────────────────────────────────────

export const signUpWithEmail = async ({ email, password, name }) => {
  let res, json;
  try {
    res = await fetch(`${backendUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    json = await res.json();
  } catch (err) {
    return { data: null, error: { message: 'Cannot reach server. Check your connection.' } };
  }

  if (!res.ok) return { data: null, error: { message: json.error || 'Signup failed.' } };

  // Do NOT persist session — user must log in manually after signup
  return { data: { user: json.user }, error: null };
};

// ─── Login — proxied through backend ─────────────────────────────────────────

export const signInWithEmail = async ({ email, password }) => {
  let res, json;
  try {
    res = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    json = await res.json();
  } catch (err) {
    return { data: null, error: { message: 'Cannot reach server. Check your connection.' } };
  }

  if (!res.ok) return { data: null, error: { message: json.error || 'Login failed.' } };

  const sessionToStore = { ...json.session, user: json.user };
  persistSession(sessionToStore);
  localStorage.setItem('authToken', json.session.access_token);
  notify('SIGNED_IN', sessionToStore);

  return { data: { user: json.user, session: sessionToStore }, error: null };
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// This requires a browser → Supabase redirect and won't work on restricted networks.
// Return a clear error so the UI can show a helpful message.

export const signInWithGoogle = async () => ({
  data: null,
  error: { message: 'Google login requires a direct connection to Supabase. Please use email & password instead.' },
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const signOutUser = async () => {
  persistSession(null);
  notify('SIGNED_OUT', null);
  return { error: null };
};
