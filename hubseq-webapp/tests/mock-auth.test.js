/**
 * @jest-environment jsdom
 */
import { useSession, signIn } from '../src/utils/mock-auth';

describe('mock-auth', () => {
  test('useSession always returns an authenticated demo session', () => {
    const { data, status } = useSession();
    expect(status).toBe('authenticated');
    expect(data.user.email).toBe('demo@hubseq.com');
    expect(data.idToken).toBeTruthy();
  });

  test('useSession returns a stable session reference across calls', () => {
    // Stable reference prevents infinite re-render loops in useEffect deps.
    expect(useSession().data).toBe(useSession().data);
  });

  test('signIn navigates to the callbackUrl', async () => {
    const assign = jest.fn();
    delete window.location;
    window.location = { assign };
    await signIn('credentials', { callbackUrl: '/files' });
    expect(assign).toHaveBeenCalledWith('/files');
  });

  test('signIn defaults to /files when no callbackUrl is given', async () => {
    const assign = jest.fn();
    delete window.location;
    window.location = { assign };
    await signIn('credentials');
    expect(assign).toHaveBeenCalledWith('/files');
  });
});
