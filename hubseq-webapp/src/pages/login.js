//
// Login page.
//
// The production app authenticated against AWS Cognito here. The local demo has
// no authentication, so this route simply forwards to the file explorer. (The
// landing-page "Login" / "Get Started" buttons already route to /files too.)
//
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/files');
  }, [router]);
  return null;
};

export default Login;
