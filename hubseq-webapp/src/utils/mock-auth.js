//
// Lightweight drop-in replacement for `next-auth/react`.
//
// The production HubSeq app authenticated users against AWS Cognito. For a
// self-contained local demo we don't want (or need) real authentication, so
// this shim provides a single static "demo" session. Every page that used to
// gate its data fetching on `if (session)` now simply always has a session.
//
// It exports the same surface the app consumes from next-auth/react:
//   - SessionProvider  (no-op passthrough wrapper)
//   - useSession()     (always authenticated as the demo user)
//   - signIn()         (just navigates to the dashboard)
//   - signOut()        (navigates back to the landing page)
//

// IMPORTANT: this object reference must be stable across renders. Several
// components use `session` as a useEffect dependency, so returning a fresh
// object each render would cause infinite re-render loops.
const DEMO_SESSION = {
  idToken: 'demo-id-token',
  user: {
    name: 'Demo User',
    email: 'demo@hubseq.com',
  },
};

export function SessionProvider({ children }) {
  return children;
}

export function useSession() {
  return { data: DEMO_SESSION, status: 'authenticated' };
}

export function getSession() {
  return Promise.resolve(DEMO_SESSION);
}

export function signIn(_provider, options) {
  const url = (options && options.callbackUrl) || '/files';
  if (typeof window !== 'undefined') {
    window.location.assign(url);
  }
  return Promise.resolve({ ok: true, url });
}

export function signOut(options) {
  const url = (options && options.callbackUrl) || '/';
  if (typeof window !== 'undefined') {
    window.location.assign(url);
  }
  return Promise.resolve({ ok: true, url });
}
