import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4">Mine Trade</h1>
          <p className="text-xl text-gray-300 mb-8">
            A run-based roguelike mining game with hardcore daily payments
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

