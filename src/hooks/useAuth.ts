// import { useState, useEffect } from 'react';
// import { NhostClient } from '@nhost/nhost-js';
// import { User } from '../types';

// const nhost = new NhostClient({
//   subdomain: 'zzkurwzborsbkjjgmode',
//   region: 'ap-south-1',
// });

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleAuth = async (mode: 'signin' | 'signup', email: string, password: string) => {
//     try {
//       setError(null);
//       setSuccessMessage(null);

//       if (user) {
//         console.log("User is already signed in.");
//         return;
//       }

//       let session, error;

//       if (mode === 'signin') {
//         ({ session, error } = await nhost.auth.signIn({
//           email,
//           password,
//         }));
//       } else if (mode === 'signup') {
//         ({ session, error } = await nhost.auth.signUp({
//           email,
//           password,
//         }));

//         if (!error) {
//           setSuccessMessage('Account created successfully! Please check your email for verification.');
//           return;
//         }
//       }

//       if (error) {
//         setError(getAuthErrorMessage(error.message));
//         return;
//       }

//       if (session?.user) {
//         const loggedInUser = {
//           id: session.user.id,
//           email: session.user.email || '',
//         };
//         setUser(loggedInUser);
//         localStorage.setItem('user', JSON.stringify(loggedInUser));
//         setSuccessMessage(mode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again.');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await nhost.auth.signOut();
//       setUser(null);
//       localStorage.removeItem('user');
//       setSuccessMessage('Signed out successfully!');
//     } catch (err) {
//       setError('Error during logout. Please try again.');
//     }
//   };

//   return {
//     user,
//     error,
//     successMessage,
//     handleAuth,
//     handleLogout,
//   };
// }

// function getAuthErrorMessage(error: string): string {
//   if (error.includes('email-already-in-use')) {
//     return 'This email is already registered. Please sign in instead.';
//   }
//   if (error.includes('invalid-email')) {
//     return 'Please enter a valid email address.';
//   }
//   if (error.includes('wrong-password')) {
//     return 'Incorrect password. Please try again.';
//   }
//   if (error.includes('user-not-found')) {
//     return 'No account found with this email. Please sign up instead.';
//   }
//   if (error.includes('too-many-requests')) {
//     return 'Too many attempts. Please try again later.';
//   }
//   return 'Authentication failed. Please try again.';
// }



import { useState, useEffect } from 'react';
import { NhostClient } from '@nhost/nhost-js';
import { User } from '../types';

const nhost = new NhostClient({
  subdomain: 'zzkurwzborsbkjjgmode',
  region: 'ap-south-1',
});

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = async (mode: 'signin' | 'signup', email: string, password: string) => {
    try {
      setError(null);
      setSuccessMessage(null);

      if (user) {
        console.log("User is already signed in.");
        return;
      }

      let session, error;

      if (mode === 'signin') {
        ({ session, error } = await nhost.auth.signIn({
          email,
          password,
        }));
      } else if (mode === 'signup') {
        ({ session, error } = await nhost.auth.signUp({
          email,
          password,
        }));

        if (!error) {
          setSuccessMessage('Account created successfully! Please check your email for verification.');
          return;
        }
      }

      if (error) {
        setError(getAuthErrorMessage(error.message));
        return;
      }

      if (session?.user) {
        const loggedInUser = {
          id: session.user.id,
          email: session.user.email || ''
        };
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('accessToken', session.accessToken);
        setSuccessMessage(mode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await nhost.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setSuccessMessage('Signed out successfully!');
    } catch (err) {
      setError('Error during logout. Please try again.');
    }
  };

  return {
    user,
    error,
    successMessage,
    handleAuth,
    handleLogout,
  };
}

function getAuthErrorMessage(error: string): string {
  if (error.includes('email-already-in-use')) {
    return 'This email is already registered. Please sign in instead.';
  }
  if (error.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (error.includes('wrong-password')) {
    return 'Incorrect password. Please try again.';
  }
  if (error.includes('user-not-found')) {
    return 'No account found with this email. Please sign up instead.';
  }
  if (error.includes('too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  return 'Authentication failed. Please try again.';
}
