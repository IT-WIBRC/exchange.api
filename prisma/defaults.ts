type Actor = "user" | "role" | "admin";
type Permission = "read" | "edit" | "create";

type Scope = `${Actor}:${Permission}`;

type UserDefaultRole = "USER" | "ADMIN";

type Role = {
  [key in Exclude<Actor, "role">]: {
    value: UserDefaultRole;
    permissions: Scope[];
  };
};

export const defaultUserPermissions: Scope[] = [
  "user:read",
  "user:edit",
] as const;

export const defaultAdminPermissions: Scope[] = [
  ...defaultUserPermissions,
  "user:read",
  "role:create",
  "role:edit",
] as const;

export const defaultRoles: Role = {
  user: {
    value: "USER",
    permissions: defaultUserPermissions,
  },
  admin: {
    value: "ADMIN",
    permissions: defaultAdminPermissions,
  },
} as const;
