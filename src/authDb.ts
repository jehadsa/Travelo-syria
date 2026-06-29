/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * authDb.ts — REFACTORED
 *
 * localStorage removed. Accounts now live in-memory only (reset on page refresh).
 * Real account management happens in App.tsx via inMemoryAccounts state.
 */

import { User } from './types';

export interface Account {
  user: User;
  pass: string;
}

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    user: {
      name: 'جهاد الصماك',
      email: 'jehadsammak5@gmail.com',
      phone: '+963 933 124 556'
    },
    pass: '123456'
  },
  {
    user: {
      name: 'سامي الأحمد',
      email: 'sami@travelo.com',
      phone: '+963 944 555 666'
    },
    pass: 'sami123'
  },
  {
    user: {
      name: 'John Doe',
      email: 'john@travelo.com',
      phone: '+1 415 888 221'
    },
    pass: 'john123'
  }
];

/**
 * These functions now accept an accounts array and return results.
 * App.tsx manages the actual accounts state.
 */

export function getAccounts(accounts: Account[] = DEFAULT_ACCOUNTS): Account[] {
  return accounts;
}

export function saveAccount(
  accounts: Account[],
  user: User,
  pass: string
): { success: boolean; updatedAccounts: Account[] } {
  if (accounts.some(acc => acc.user.email.toLowerCase() === user.email.toLowerCase())) {
    return { success: false, updatedAccounts: accounts };
  }
  return { success: true, updatedAccounts: [...accounts, { user, pass }] };
}

export function verifyLogin(
  accounts: Account[],
  email: string,
  pass: string
): User | null {
  const matched = accounts.find(
    acc => acc.user.email.toLowerCase() === email.toLowerCase() && acc.pass === pass
  );
  return matched ? matched.user : null;
}

export function updateAccountDetails(
  accounts: Account[],
  email: string,
  updatedName: string,
  updatedPass?: string
): { user: User | null; updatedAccounts: Account[] } {
  const index = accounts.findIndex(acc => acc.user.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return { user: null, updatedAccounts: accounts };

  const updated = [...accounts];
  updated[index] = {
    ...updated[index],
    user: { ...updated[index].user, name: updatedName },
    pass: updatedPass || updated[index].pass
  };

  return { user: updated[index].user, updatedAccounts: updated };
}
