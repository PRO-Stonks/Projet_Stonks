/**
 * Helper to add user in db for CI
 */

conn = new Mongo();
db = conn.getDB("admin");
db.createUser({user: "stonks", pwd: "stonksstonks",roles: [ { role: "userAdminAnyDatabase", db: "admin" },"readWriteAnyDatabase" ] })