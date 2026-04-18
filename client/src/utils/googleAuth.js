import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const getMessageFromFirebaseError = (error) => {
  switch (error?.code) {
    case 'auth/popup-blocked':
      return 'Trình duyệt đang chặn popup Google. Hãy cho phép popup và thử lại.';
    case 'auth/popup-closed-by-user':
      return 'Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn tất.';
    case 'auth/cancelled-popup-request':
      return 'Yêu cầu đăng nhập Google trước đó đã bị hủy.';
    case 'auth/unauthorized-domain':
      return 'Domain hiện tại chưa được thêm vào Firebase Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in chua duoc bat trong Firebase Authentication.';
    case 'auth/invalid-api-key':
      return 'Firebase API key không hợp lệ. Hãy kiểm tra lại file .env.';
    default:
      return error?.message || 'Không thể đăng nhập Google lúc này.';
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
    throw new Error('Tài khoản Google này không trả về email.');
  }

  return profile;
};

export { getMessageFromFirebaseError };
