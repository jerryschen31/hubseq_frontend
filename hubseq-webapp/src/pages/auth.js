import { useSession, signIn, signOut } from "utils/mock-auth"
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        You are signed in<br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Please sign in <br />
      <button onClick={() => signIn('coginito', { callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL })}>Sign in</button>
    </>
  )
}
