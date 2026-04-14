import { loginWithGoogle, logout, auth } from '../../services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import styles from './GoogleSignIn.module.css';

interface GoogleSignInProps {
  onUserChange: (user: User | null) => void;
}

export default function GoogleSignIn({ onUserChange }: GoogleSignInProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      onUserChange(u);
    });
    return unsubscribe;
  }, [onUserChange]);

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <div className={styles.container}>
        <img src={user.photoURL || ''} alt={user.displayName || ''} className={styles.avatar} />
        <span className={styles.name}>{user.displayName}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} className={styles.loginButton}>
      Sign in with Google
    </button>
  );
}
