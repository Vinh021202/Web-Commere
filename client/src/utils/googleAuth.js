import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const getMessageFromFirebaseError = (error) => {
  switch (error?.code) {
    case 'auth/popup-blocked':
      return 'Trinh duyet dang chan popup Google. Hay cho phep popup va thu lai.';
    case 'auth/popup-closed-by-user':
      return 'Ban da dong cua so dang nhap Google truoc khi hoan tat.';
    case 'auth/cancelled-popup-request':
      return 'Yeu cau dang nhap Google truoc do da bi huy.';
    case 'auth/unauthorized-domain':
      return 'Domain hien tai chua duoc them vao Firebase Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in chua duoc bat trong Firebase Authentication.';
    case 'auth/invalid-api-key':
      return 'Firebase API key khong hop le. Hay kiem tra lai file .env.';
    default:
      return error?.message || 'Khong the dang nhap Google luc nay.';
  }
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const user = result.user;
  const providerProfile = user?.providerData?.find((item) => item?.providerId === 'google.com');
  const idToken = await user.getIdToken();

  const profile = {
    name: providerProfile?.displayName || user?.displayName || '',
    email: providerProfile?.email || user?.email || '',
    avatar: providerProfile?.photoURL || user?.photoURL || '',
    mobile: providerProfile?.phoneNumber || user?.phoneNumber || '',
    googleId: user?.uid || '',
    idToken,
    accessToken: credential?.accessToken || '',
    role: 'USER',
    password: null,
  };

  if (!profile.email) {
    throw new Error('Tai khoan Google nay khong tra ve email.');
  }

  return profile;
};

export { getMessageFromFirebaseError };
