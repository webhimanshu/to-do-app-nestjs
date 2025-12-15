import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Todo App
        </h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-block bg-white hover:bg-gray-100 text-indigo-600 font-semibold py-3 px-6 rounded-lg border-2 border-indigo-600 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
