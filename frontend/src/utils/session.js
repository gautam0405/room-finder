const TOKEN_KEY = 'roomFinderToken';
const USER_KEY = 'roomFinderUser';

export const ROLE = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  USER: 'user',
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const normalizeRole = (role) => String(role || '').toLowerCase();

export const setSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...user,
      role: normalizeRole(user?.role),
    }),
  );
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSessionUser = () => {
  const parsed = safeParse(localStorage.getItem(USER_KEY) || '');
  if (!parsed || !parsed.role) {
    return null;
  }

  return {
    ...parsed,
    role: normalizeRole(parsed.role),
  };
};

export const isAuthenticated = () =>
  Boolean(getToken() && getSessionUser());


// 🔥 FIXED ROUTE LOGIC
export const getDefaultRoute = (user = getSessionUser()) => {
  const role = normalizeRole(user?.role);

  if (role === 'admin') {
    return '/admin-dashboard';
  }

  if (role === 'employee') {
    return '/landlord-dashboard';
  }

  return '/'; // user
};
