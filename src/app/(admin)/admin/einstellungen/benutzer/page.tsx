import { requireAdminSession } from "@/lib/auth/session";
import { userManagement } from "@/lib/admin/users-server";
import { AdminUsers } from "@/components/admin/admin-users";

export const metadata = { title: "Benutzerverwaltung" };
export default async function UsersPage() {
  const session = await requireAdminSession();
  const users = await userManagement.list(session);
  return <AdminUsers users={users} currentUid={session.uid} />;
}
