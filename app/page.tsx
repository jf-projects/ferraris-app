import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import Navbar from './navbar';
import LoginForm from './components/LoginForm';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      {/* <Navbar /> */}
      <LoginForm />
    </main>
  )
}
