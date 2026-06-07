/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from './types';
import { setStoredUser } from './localStorageEngine';

const KEY_ACCOUNTS = 'travelo_accounts';

interface Account {
  user: User;
  pass: string;
}

const DEFAULT_ACCOUNTS: Account[] = [];

export function getAccounts(): Account[] {
  const current = localStorage.getItem(KEY_ACCOUNTS);
  if (!current) {
    localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  try {
    return JSON.parse(current);
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveAccount(user: User, pass: string): boolean {
  const accounts = getAccounts();
  if (accounts.some(acc => acc.user.email.toLowerCase() === user.email.toLowerCase())) {
    return false; // already exists
  }
  const updated = [...accounts, { user, pass }];
  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(updated));
  return true;
}

export function verifyAndLogin(email: string, pass: string): User | null {
  const accounts = getAccounts();
  const matched = accounts.find(
    acc => acc.user.email.toLowerCase() === email.toLowerCase() && acc.pass === pass
  );
  if (matched) {
    setStoredUser(matched.user);
    return matched.user;
  }
  return null;
}

export function updateAccountDetails(email: string, updatedName: string, updatedPass?: string): User | null {
  const accounts = getAccounts();
  const index = accounts.findIndex(acc => acc.user.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return null;

  accounts[index].user.name = updatedName;
  if (updatedPass) {
    accounts[index].pass = updatedPass;
  }

  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
  setStoredUser(accounts[index].user);
  return accounts[index].user;
}
