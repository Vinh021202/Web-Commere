export const getFirebaseAuthErrorMessage = (error) => {
  const errorCode = error?.code || "";
  const currentHost =
    typeof window !== "undefined" ? window.location.hostname : "";
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "";

  if (errorCode === "auth/unauthorized-domain") {
    const domainLabel = currentHost || currentOrigin || "current domain";

    return `Domain ${domainLabel} chua duoc them vao Firebase Authorized Domains. Vao Firebase Console > Authentication > Settings > Authorized domains va them domain nay, sau do thu dang nhap Google lai.`;
  }

  if (errorCode === "auth/popup-closed-by-user") {
    return "Ban da dong cua so dang nhap Google truoc khi hoan tat.";
  }

  if (errorCode === "auth/popup-blocked") {
    return "Trinh duyet dang chan popup dang nhap Google. Hay cho phep popup va thu lai.";
  }

  return error?.message || "Khong the dang nhap bang Google luc nay.";
};
