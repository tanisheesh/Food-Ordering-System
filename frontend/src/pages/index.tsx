import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/lib/graphql/queries';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) router.push('/restaurants');
  }, [router]);

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('userId', data.login.id);
      localStorage.setItem('userRole', data.login.role);
      localStorage.setItem('userName', data.login.name);
      localStorage.setItem('userCountry', data.login.country);
      router.push('/restaurants');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const testUsers = [
    { name: 'Nick Fury', role: 'Admin', email: 'nick.fury@slooze.xyz', icon: '👨‍💼' },
    { name: 'Captain Marvel', role: 'Manager-India', email: 'captain.marvel@slooze.xyz', icon: '🇮🇳' },
    { name: 'Captain America', role: 'Manager-America', email: 'captain.america@slooze.xyz', icon: '🇺🇸' },
    { name: 'Thanos', role: 'Member-India', email: 'thanos@slooze.xyz', icon: '🇮🇳' },
    { name: 'Thor', role: 'Member-India', email: 'thor@slooze.xyz', icon: '🇮🇳' },
    { name: 'Travis', role: 'Member-America', email: 'travis@slooze.xyz', icon: '🇺🇸' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Food Ordering System</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Login Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Quick Login Buttons */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Login</h2>
            <p className="text-sm text-gray-600 mb-3">Click to fill credentials (password: password)</p>
            <div className="space-y-2">
              {testUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => fillCredentials(user.email)}
                  className="w-full text-left px-4 py-3 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-3"
                >
                  <span className="text-2xl">{user.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                  <span className="text-blue-600 text-sm">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
