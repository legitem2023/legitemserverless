// app/auth/signin/page.tsx
import { getProviders, signIn, ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import  Provider  from 'next-auth';

interface SignInProps {
  providers: Record<LiteralUnion<string, string>, ClientSafeProvider>;
}

const SignIn = ({ providers }: SignInProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        {providers && Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id)}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps<SignInProps> = async () => {
//   const providers = await getProviders();
//   return {
//     props: { providers },
//   };
// };

export default SignIn;
