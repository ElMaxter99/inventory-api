const Inventory = require("../models/inventory.model");
const User = require("../models/user.model");
const { getMemberRole } = require("../utils/permissions");

async function addMember(req, res) {
  const inventory = req.inventory;
  const { email, role } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ data: null, error: { message: "User not found" } });
  inventory.members = inventory.members || [];
  const existing = inventory.members.find(
    (m) => String(m.userId) === String(user._id)
  );
  if (existing) {
    return res
      .status(409)
      .json({ data: null, error: { message: "Member already exists" } });
  }
  inventory.members.push({ userId: user._id, role });
  await Inventory.findByIdAndUpdate(inventory._id, {
    members: inventory.members,
  });
  res.status(201).json({ data: true, error: null });
}

async function updateMemberRole(req, res) {
  const inventory = req.inventory;
  inventory.members = inventory.members || [];
  const memberId = req.params.memberId;
  const member = inventory.members.find(
    (m) => String(m._id) === String(memberId)
  );
  if (!member)
    return res
      .status(404)
      .json({ data: null, error: { message: "Member not found" } });
  member.role = req.body.role;
  await Inventory.findByIdAndUpdate(inventory._id, {
    members: inventory.members,
  });
  res.json({ data: true, error: null });
}

async function removeMember(req, res) {
  const inventory = req.inventory;
  inventory.members = inventory.members || [];
  const memberId = req.params.memberId;
  const member = inventory.members.find(
    (m) => String(m._id) === String(memberId)
  );
  if (!member)
    return res
      .status(404)
      .json({ data: null, error: { message: "Member not found" } });
  const requesterId = req.user?.sub;
  const requesterRole = getMemberRole(inventory, requesterId);
  if (String(member.userId) === String(requesterId) && requesterRole !== "owner") {
    return res.status(403).json({
      data: null,
      error: { message: "Owner required to remove yourself" },
    });
  }
  inventory.members = inventory.members.filter(
    (m) => String(m._id) !== String(memberId)
  );
  await Inventory.findByIdAndUpdate(inventory._id, {
    members: inventory.members,
  });
  res.json({ data: true, error: null });
}

module.exports = {
  addMember,
  updateMemberRole,
  removeMember,
};
