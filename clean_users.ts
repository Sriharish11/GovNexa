
import { db } from "./server/db";
import { users } from "./shared/models/auth";

async function main() {
  console.log("Deleting all users...");
  await db.delete(users);
  console.log("Users deleted.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
