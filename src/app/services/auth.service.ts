import { Permit } from 'permit-fe-sdk';

export type UserRole = "admin" | "moderator" | "editor" | "viewer";

export const users: Record<UserRole, { email: string }> = {
  "admin": { email: "admin@angular-rbac.app" },
  "moderator": { email: "moderator@angular-rbac.app" },
  "editor": { email: "editor@angular-rbac.app" },
  "viewer": { email: "viewer@angular-rbac.app" },
};

export const loadUserAbilities = async (loggedInUser: string) => {
  const permit = Permit({
    loggedInUser: loggedInUser,
    backendUrl: "http://localhost:4000/",
  });

  permit.reset();

  await permit.loadLocalStateBulk([
    { action: "create", resource: "Task" },
    { action: "read", resource: "Task" },
    { action: "update", resource: "Task" },
    { action: "delete", resource: "Task" },
  ]);

  return permit.getCaslJson();
}

