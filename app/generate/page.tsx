import { redirect } from "next/navigation";

export default function GeneratePage() {
  // Redirect to the main page since the generation functionality is already on the home page
  redirect("/");
}