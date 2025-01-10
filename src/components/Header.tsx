// import React, { useState } from 'react';
// import { LogOut } from 'lucide-react';
// import { User } from '../types';
// import { AuthForm } from './AuthForm';

// interface HeaderProps {
//   user: User | null;
//   onLogout: () => void;
//   onAuth: (email: string, password: string) => Promise<void>;
// }

// export function Header({ user, onLogout, onAuth }: HeaderProps) {
//   const [showAuth, setShowAuth] = useState(false);
//   const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

//   return (
//     <header className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Video Summarizer</h1>
//         <div>
//           {user ? (
//             <button
//               onClick={onLogout}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
//             >
//               <span>{user.email}</span>
//               <LogOut className="h-5 w-5" />
//             </button>
//           ) : (
//             <div className="flex gap-4">
//               <button
//                 onClick={() => {
//                   setAuthMode('signin');
//                   setShowAuth(true);
//                 }}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => {
//                   setAuthMode('signup');
//                   setShowAuth(true);
//                 }}
//                 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
//               >
//                 Sign Up
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {showAuth && !user && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <AuthForm
//               mode={authMode}
//               onSubmit={async (authmode, email, password) => {
//                 console.log(1234+password)
//                 await onAuth(authmode,email, password);
//                 setShowAuth(false);
//               }}
//               onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
//               onClose={() => setShowAuth(false)}
//             />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { User } from '../types';
import { AuthForm } from './AuthForm';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onAuth: (email: string, password: string) => Promise<void>;
}

export function Header({ user, error, onLogout, onAuth }: HeaderProps) {
  
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Video Summarizer</h1>
        <div>
          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <span>{user.email}</span>
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuth(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <AuthForm
              mode={authMode}
              error={error} 
              onSubmit={async (authmode, email, password) => {
                console.log("middle", error)
                await onAuth(authmode, email, password);
                // setShowAuth(false)
              }}
              onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              onClose={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
