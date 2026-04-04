import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth/server";

export default async function RootPage() {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
