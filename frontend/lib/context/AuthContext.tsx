'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole, customName?: string, customPhone?: string, location?: { division: string; district: string; upazila?: string }) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  customer: {
    id: 'cust_1',
    name: 'Tanvir Hossain',
    email: 'tanvir@gmail.com',
    role: 'customer',
    phone: '+880 1700-112233',
    location: { division: 'Dhaka', district: 'Dhaka', upazila: 'Mirpur' }
  },
  broker: {
    id: 'u_b1',
    name: 'Mirpur Labour & Technical Service',
    email: 'mirpur.broker@labour.com',
    role: 'broker',
    phone: '+880 1711-889922',
    brokerId: 'b1',
    location: { division: 'Dhaka', district: 'Dhaka', upazila: 'Mirpur' }
  },
  admin: {
    id: 'admin_1',
    name: 'Labour.com Platform Admin',
    email: 'admin@labour.com',
    role: 'admin',
    phone: '+880 1700-000000'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [user, setUser] = useState<User | null>(DEFAULT_USERS.customer);

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('labour_user_profile');
      const savedRole = localStorage.getItem('labour_role') as UserRole;

      if (savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        setUser(parsedUser);
        if (parsedUser.role) setRoleState(parsedUser.role);
      } else if (savedRole && DEFAULT_USERS[savedRole]) {
        setRoleState(savedRole);
        setUser(DEFAULT_USERS[savedRole]);
      }
    } catch (e) {
      console.error('Failed loading saved user profile', e);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser(DEFAULT_USERS[newRole]);
    localStorage.setItem('labour_role', newRole);
    localStorage.setItem('labour_user_profile', JSON.stringify(DEFAULT_USERS[newRole]));
  };

  const login = (
    email: string, 
    userRole: UserRole, 
    customName?: string, 
    customPhone?: string, 
    location?: { division: string; district: string; upazila?: string }
  ) => {
    let newUser: User;

    if (email === 'tanvir@gmail.com') {
      newUser = DEFAULT_USERS.customer;
    } else if (email === 'mirpur.broker@labour.com') {
      newUser = DEFAULT_USERS.broker;
    } else if (email === 'admin@labour.com') {
      newUser = DEFAULT_USERS.admin;
    } else {
      newUser = {
        id: `u_${Date.now()}`,
        name: customName || email.split('@')[0],
        email: email,
        role: userRole,
        phone: customPhone || '+880 1700-000000',
        location: location ? { division: location.division as any, district: location.district, upazila: location.upazila || 'Mirpur' } : { division: 'Dhaka', district: 'Dhaka', upazila: 'Mirpur' }
      };
    }

    setUser(newUser);
    setRoleState(userRole);
    localStorage.setItem('labour_role', userRole);
    localStorage.setItem('labour_user_profile', JSON.stringify(newUser));

    // Asynchronously write newly created user into MongoDB Atlas 'users' collection!
    try {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        })
      }).catch(err => console.warn('MongoDB Atlas user sync notice:', err));
    } catch (_e) {}
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('labour_user_profile');
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
