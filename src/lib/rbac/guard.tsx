import React from 'react';
import { StandardPermission, BosRoleKey, SYSTEM_ROLES, AccountStatus } from './permissions';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: BosRoleKey | string;
  roleTitle: string;
  branch: string;
  avatar?: string;
  status: AccountStatus | 'active' | 'inactive';
  permissions?: StandardPermission[];
}

/**
 * Returns all active permissions for a given user.
 * Merges role-level default permissions with any user-specific granular overrides.
 */
export function resolveUserPermissions(user: AuthenticatedUser | null | undefined): Set<StandardPermission> {
  if (!user) return new Set();

  const userPerms = new Set<StandardPermission>();

  // 1. Role-based standard permissions
  const roleDef = SYSTEM_ROLES[user.role as BosRoleKey];
  if (roleDef && roleDef.permissions) {
    roleDef.permissions.forEach(p => userPerms.add(p));
  }

  // 2. Direct user granular permissions
  if (Array.isArray(user.permissions)) {
    user.permissions.forEach(p => userPerms.add(p));
  }

  return userPerms;
}

/**
 * Check if the user has a specific permission.
 */
export function hasPermission(
  user: AuthenticatedUser | null | undefined,
  permission: StandardPermission
): boolean {
  if (!user) return false;
  if (user.status !== 'Active' && user.status !== 'active') return false;
  const userPerms = resolveUserPermissions(user);
  return userPerms.has(permission);
}

/**
 * Check if the user has AT LEAST ONE of the requested permissions.
 */
export function hasAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: StandardPermission[]
): boolean {
  if (!user || permissions.length === 0) return false;
  if (user.status !== 'Active' && user.status !== 'active') return false;
  const userPerms = resolveUserPermissions(user);
  return permissions.some(p => userPerms.has(p));
}

/**
 * Check if the user has ALL of the requested permissions.
 */
export function hasAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: StandardPermission[]
): boolean {
  if (!user || permissions.length === 0) return false;
  if (user.status !== 'Active' && user.status !== 'active') return false;
  const userPerms = resolveUserPermissions(user);
  return permissions.every(p => userPerms.has(p));
}

/**
 * Validates if the user's account status permits accessing the BOS.
 */
export function checkAccountStatus(user: AuthenticatedUser | null | undefined): {
  allowed: boolean;
  status: AccountStatus;
  reason?: string;
} {
  if (!user) {
    return { allowed: false, status: 'Disabled', reason: 'No user session found.' };
  }

  const rawStatus = (user.status || 'Active').toLowerCase();

  if (rawStatus === 'active') {
    return { allowed: true, status: 'Active' };
  }

  if (rawStatus === 'suspended') {
    return {
      allowed: false,
      status: 'Suspended',
      reason: 'Your account has been temporarily suspended by an administrator. Please contact IT Security.'
    };
  }

  if (rawStatus === 'disabled') {
    return {
      allowed: false,
      status: 'Disabled',
      reason: 'This account is deactivated. Access to Agro-Deliveries Ke. BOS is denied.'
    };
  }

  if (rawStatus === 'invited') {
    return {
      allowed: false,
      status: 'Invited',
      reason: 'Your invitation has not yet completed initial password setup.'
    };
  }

  return { allowed: false, status: 'Disabled', reason: 'Account status invalid.' };
}

// ==========================================
// React Authorization Guard Components
// ==========================================

interface CanProps {
  user: AuthenticatedUser | null | undefined;
  permission: StandardPermission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * <Can user={user} permission="orders.create">
 *   <button>Create Order</button>
 * </Can>
 */
export const Can: React.FC<CanProps> = ({ user, permission, fallback = null, children }) => {
  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

interface CanAnyProps {
  user: AuthenticatedUser | null | undefined;
  permissions: StandardPermission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CanAny: React.FC<CanAnyProps> = ({ user, permissions, fallback = null, children }) => {
  if (!hasAnyPermission(user, permissions)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
