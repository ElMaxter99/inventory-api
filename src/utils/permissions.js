const roleOrder = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

function getMemberRole(inventory, userId) {
  if (!inventory || !userId) return null;
  const member = (inventory.members || []).find(
    (m) => String(m.userId) === String(userId)
  );
  return member ? member.role : null;
}

function hasRole(inventory, userId, minRole) {
  const role = getMemberRole(inventory, userId);
  if (!role) return false;
  return roleOrder[role] >= roleOrder[minRole];
}

module.exports = {
  roleOrder,
  getMemberRole,
  hasRole,
};
