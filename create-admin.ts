import { auth } from "./src/lib/auth";

async function main() {
  const email = "admin@example.com";
  const password = "password123";
  const name = "Admin AuctSimply";

  console.log(`Creating admin user: ${email}...`);

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("Admin created successfully!");
    console.log(user);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

main();
