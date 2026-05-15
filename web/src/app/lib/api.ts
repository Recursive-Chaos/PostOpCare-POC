// asta decide care e URL-ul API-ului
// public API e pe northflank
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type StoredSession = {
  access_token?: string;
};

function readSession(): StoredSession | null {
  try {
    return JSON.parse(localStorage.getItem("session") ?? "null");
  } catch {
    return null;
  }
}

export function hasStoredSession() {
  return Boolean(readSession()?.access_token);
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("session");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// wrapper pentru fetch care adauga automat token-ul in header
export async function authFetch(input: string, init: RequestInit = {}) {
  const session = readSession();

  if (!session?.access_token) {
    logout(); // daca n-am token, nu sunt autentificat
    return new Response(null, { status: 401 });
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);

  // fetch normal cu autentificare inclusa
  const res = await fetch(input, { ...init, headers });

  if (res.status === 401 || res.status === 403) {
    logout();
  }

  return res;
}
