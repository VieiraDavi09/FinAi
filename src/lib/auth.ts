// Sistema de Autenticação — FinAI
// Persiste usuários e sessão com isolamento de dados

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // SHA-256 hash (simulado via btoa)
  createdAt: string;
  avatarInitial: string;
  profileType: 'student' | 'freelancer' | 'standard';
  isPremium?: boolean;
}

const KEYS = {
  USERS: 'finai_auth_users',
  SESSION: 'finai_auth_session',
};

// Simula hash da senha
function hashPassword(password: string): string {
  return btoa(encodeURIComponent(password + '_finai_salt_2026'));
}

function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export const auth = {
  register: (fullName: string, email: string, password: string): { success: boolean; error?: string; user?: AuthUser } => {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();
    
    if (!cleanName) {
      return { success: false, error: 'Por favor, informe seu nome completo.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Por favor, informe um e-mail válido.' };
    }
    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Este e-mail já está cadastrado. Tente fazer login.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    const user: AuthUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      fullName: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      avatarInitial: cleanName.charAt(0).toUpperCase(),
      profileType: 'student',
      isPremium: false,
    };

    users.push(user);
    saveUsers(users);

    // Auto login após cadastro
    auth.saveSession(user);
    return { success: true, user };
  },

  login: (email: string, password: string): { success: boolean; error?: string; user?: AuthUser } => {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'E-mail não cadastrado.' };
    }
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Senha incorreta. Verifique e tente novamente.' };
    }
    auth.saveSession(user);
    return { success: true, user };
  },

  socialLogin: (provider: 'google' | 'github', mockName?: string, mockEmail?: string): { success: boolean; user?: AuthUser } => {
    const users = getUsers();
    const name = mockName || (provider === 'google' ? 'Usuário Google' : 'Usuário GitHub');
    const email = mockEmail || `${provider}_user_${Math.random().toString(36).substring(2, 7)}@finai.app`;

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 11),
        fullName: name,
        email: email.toLowerCase(),
        passwordHash: hashPassword('social_login_secret_' + Math.random()),
        createdAt: new Date().toISOString(),
        avatarInitial: name.charAt(0).toUpperCase(),
        profileType: 'student',
        isPremium: false,
      };
      users.push(user);
      saveUsers(users);
    }

    auth.saveSession(user);
    return { success: true, user };
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.SESSION);
  },

  getSession: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveSession: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  },

  isLoggedIn: (): boolean => {
    return auth.getSession() !== null;
  },

  updateUser: (updates: Partial<AuthUser>): AuthUser | null => {
    const session = auth.getSession();
    if (!session) return null;

    const users = getUsers();
    const index = users.findIndex(u => u.id === session.id);
    const updated = { ...session, ...updates };

    if (index !== -1) {
      users[index] = updated;
      saveUsers(users);
    }
    auth.saveSession(updated);
    return updated;
  },

  changePassword: (oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    const session = auth.getSession();
    if (!session) return { success: false, error: 'Sessão inválida.' };

    if (session.passwordHash !== hashPassword(oldPassword)) {
      return { success: false, error: 'Senha atual incorreta.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    auth.updateUser({ passwordHash: hashPassword(newPassword) });
    return { success: true };
  },

  deleteAccount: (): boolean => {
    const session = auth.getSession();
    if (!session) return false;

    const users = getUsers().filter(u => u.id !== session.id);
    saveUsers(users);
    auth.logout();
    return true;
  }
};

