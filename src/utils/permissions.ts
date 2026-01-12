export type InventoryRole = "viewer" | "editor" | "admin" | "owner";

export const roleOrder: Record<InventoryRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

export function getMemberRole(inventory: any, userId?: string) {
  if (!inventory || !userId) return null;
  const member = (inventory.members || []).find(
    (m: any) => String(m.userId) === String(userId)
  );
  return member ? (member.role as InventoryRole) : null;
}

export function hasRole(
  inventory: any,
  userId: string | undefined,
  minRole: InventoryRole
) {
  const role = getMemberRole(inventory, userId);
  if (!role) return false;
  return roleOrder[role] >= roleOrder[minRole];
}
