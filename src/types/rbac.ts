/**
 * RBAC Types — Role-Based Access Control
 */

export type UserRole = "admin" | "office_owner" | "agent" | "marketing";

export interface Permission {
  resource: string;
  actions: ("read" | "write" | "delete" | "manage")[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [{ resource: "*", actions: ["read", "write", "delete", "manage"] }],
  office_owner: [
    { resource: "office", actions: ["read", "write", "manage"] },
    { resource: "properties", actions: ["read", "write", "delete"] },
    { resource: "leads", actions: ["read", "write", "delete"] },
    { resource: "ai_agent", actions: ["read", "write", "manage"] },
    { resource: "whatsapp", actions: ["read", "write", "manage"] },
    { resource: "analytics", actions: ["read"] },
    { resource: "payments", actions: ["read", "write"] },
    { resource: "viewings", actions: ["read", "write", "delete"] },
    { resource: "messages", actions: ["read", "write"] },
    { resource: "settings", actions: ["read", "write"] },
    { resource: "reports", actions: ["read"] },
    { resource: "notifications", actions: ["read", "write"] },
  ],
  agent: [
    { resource: "properties", actions: ["read", "write"] },
    { resource: "leads", actions: ["read", "write"] },
    { resource: "viewings", actions: ["read", "write"] },
    { resource: "messages", actions: ["read", "write"] },
    { resource: "analytics", actions: ["read"] },
    { resource: "notifications", actions: ["read"] },
  ],
  marketing: [
    { resource: "analytics", actions: ["read"] },
    { resource: "properties", actions: ["read"] },
    { resource: "leads", actions: ["read"] },
    { resource: "reports", actions: ["read"] },
    { resource: "notifications", actions: ["read"] },
  ],
};

/**
 * Check if a role has permission for a specific resource and action
 */
export function hasPermission(
  role: UserRole,
  resource: string,
  action: "read" | "write" | "delete" | "manage",
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.some(
    (p) =>
      (p.resource === "*" || p.resource === resource) &&
      p.actions.includes(action),
  );
}
