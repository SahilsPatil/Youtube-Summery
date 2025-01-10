// import React, { useState } from 'react';
// import { Mail, Lock, Loader2, X } from 'lucide-react';

// interface AuthFormProps {
//   mode: 'signin' | 'signup';
//   onSubmit: (mode: 'signin' | 'signup', email: string, password: string) => Promise<void>;
//   onToggleMode: () => void;
//   onClose: () => void;
// }

// export function AuthForm({ mode, onSubmit, onToggleMode, onClose }: AuthFormProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       console.log(password)
//       await onSubmit(mode, email, password);
//     } catch (error) {
//       console.error('Auth error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">
//           {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
//         </h2>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-500"
//         >
//           <X className="h-5 w-5" />
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <div className="mt-1 relative">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <div className="mt-1 relative">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
//         >
//           {loading ? (
//             <Loader2 className="animate-spin h-5 w-5" />
//           ) : mode === 'signin' ? (
//             'Sign In'
//           ) : (
//             'Sign Up'
//           )}
//         </button>
//       </form>
//       <p className="mt-4 text-center text-sm text-gray-600">
//         {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
//         <button
//           onClick={onToggleMode}
//           className="text-blue-600 hover:text-blue-500 font-medium"
//         >
//           {mode === 'signin' ? 'Sign Up' : 'Sign In'}
//         </button>
//       </p>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Mail, Lock, Loader2, X } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (mode: 'signin' | 'signup', email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
  onClose: () => void;
  error: string | null; // Added error prop
}

export function AuthForm({
  mode,
  error,
  onSubmit,
  onToggleMode,
  onClose,
   // Add error prop
}: AuthFormProps & { error: string | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  console.log("helllo",error)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(mode, email, password);
      if (!error) {
        onClose();
      } 
      if (error==false) {
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : mode === 'signin' ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}
