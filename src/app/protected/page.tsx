// app/protected/page.tsx
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProtectedPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Protected Content</h1>
      <p>Welcome, {session.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-4 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProtectedPage;
