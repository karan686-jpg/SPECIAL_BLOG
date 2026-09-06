import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
const { requireAdmin } = await import("../middleware/auth.js");

const tokenFor = (role) => jwt.sign({ role }, process.env.JWT_SECRET, {
  subject: role === "admin" ? "admin" : "user-id",
  issuer: "blogify-api",
  audience: "blogify-client",
  expiresIn: "1h",
});

const response = () => {
  const result = { statusCode: 200, body: null };
  result.status = (code) => { result.statusCode = code; return result; };
  result.json = (body) => { result.body = body; return result; };
  return result;
};

test("requireAdmin accepts an administrator token", () => {
  const req = { headers: { authorization: `Bearer ${tokenFor("admin")}` } };
  const res = response();
  let proceeded = false;
  requireAdmin(req, res, () => { proceeded = true; });
  assert.equal(proceeded, true);
  assert.equal(req.auth.role, "admin");
});

test("requireAdmin rejects a regular user token", () => {
  const req = { headers: { authorization: `Bearer ${tokenFor("user")}` } };
  const res = response();
  requireAdmin(req, res, () => assert.fail("next must not be called"));
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
});
