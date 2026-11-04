/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Designated sole owner of this private Speak in Progress creator workspace
export const OWNER_EMAIL = 'smselimreja77@gmail.com';

/**
 * Validates whether a signed-in user's email matches the authorized owner.
 * Designed to be flexible for future SaaS multi-user extensions.
 */
export function isAuthorizedOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
}
