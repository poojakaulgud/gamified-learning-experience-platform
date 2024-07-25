import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
// import redirect from nextjs routing
import { useRouter } from 'next/navigation';

// import auth app from firebase
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

// import services function
// import { loginUser } from '@/services/userServices';

// interface for retrieved login object
interface User {
  role: string;
  name: string;
  email: string;
  photoURL: string;
  uid: string;
  job_title: string;
  bio: string;
}

// needs isExpired value added and method to check expiration
interface AuthContextInterface {
  user: {
    displayName?: string;
    email?: string;
    photoURL?: string;
    uid?: string;
    accessToken?: string;
  };
  userData: {
    role: string;
    name: string;
    email: string;
    photoURL: string;
    uid: string;
    job_title: string;
    bio: string;
  };
  // role: string;
  loggedIn: boolean;

  googleSignIn: () => void;
  logout: () => void;
  isTokenExpired: () => void;
  // eslint-disable-next-line no-unused-vars
  handleUserRole: ({ role }: { role: string }) => void;
  // eslint-disable-next-line no-unused-vars
  handleUserData: (userObj: User) => void;
  isLoggedIn: () => void;
}

// initialize Auth Context and pass type interface
const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

// Auth Provider with user state and functions
export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  // user state
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({
    role: '',
    name: '',
    email: '',
    photoURL: '',
    uid: '',
    job_title: '',
    bio: '',
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // login function using GoogleAuthProvider from firebase
  const googleSignIn = async () => {
    // instantiate new google auth provider and await sign in
    const provider = new GoogleAuthProvider();
    // trigger popup
    const result = await signInWithPopup(auth, provider);
    // run cloud function to check if user exists and save if doesn't
    const obj = {
      role: userData.role,
      name: result.user.displayName ?? '',
      email: result.user.email ?? '',
      photoURL: result.user.photoURL ?? '',
      uid: result.user.uid,
      job_title: '',
      bio: '',
    };

    const userDocRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const { role, name, email, photoURL, uid, job_title, bio } =
        await userSnap.data();

      console.log({ role, name, email, photoURL, uid, job_title, bio });
      if (role !== obj.role) {
        // update object here
        await updateDoc(userDocRef, {
          role: obj.role,
        });
        const updateSnap = await getDoc(userDocRef);
        if (updateSnap.exists()) {
          const { role, name, email, photoURL, uid, job_title, bio } =
            await updateSnap.data();
          console.log({ role, name, email, photoURL, uid, job_title, bio });
          setUserData({ role, name, email, photoURL, uid, job_title, bio });
        }
      } else {
        setUserData({ role, name, email, photoURL, uid, job_title, bio });
      }
    } else {
      const userRef = collection(db, 'users');
      const newUser = await setDoc(doc(userRef, result.user.uid), obj);
      console.log(newUser);
      const newSnap = await getDoc(userDocRef);
      if (newSnap.exists()) {
        const { role, name, email, photoURL, uid, job_title, bio } =
          await newSnap.data();
        console.log({ role, name, email, photoURL, uid, job_title, bio });
        setUserData({ role, name, email, photoURL, uid, job_title, bio });
      }
    }

    setLoggedIn(true);
  };

  // logout function using signOut from firebase
  const logout = async () => {
    await signOut(auth);
    setLoggedIn(false);
    router.push('/');
  };

  // is token expired
  const isTokenExpired = async () => {
    // use firebase method to check expiration
    // use the isExpired key from user object
  };

  const isLoggedIn = async () => loggedIn;

  const handleUserRole = ({ role }: { role: string }) => {
    setUserData({ ...userData, role: role });
  };

  const handleUserData = (userObj: User) => {
    setUserData({ ...userData, ...userObj });
  };

  const checkUserStatus = useCallback(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      currentUser ? setUser({ ...currentUser }) : setUser({});
    });

    return () => unsubscribe();
  }, []);

  // create use effect that checks if user is logged in or not - user dependency
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        // role,
        googleSignIn,
        logout,
        isTokenExpired,
        handleUserData,
        handleUserRole,
        isLoggedIn,
        loggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// create and export useAuth hook
export const UserAuth = () => useContext(AuthContext);
