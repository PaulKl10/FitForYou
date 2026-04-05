import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Laisser passer manifeste PWA, SW et robots sans session — sinon Chrome reçoit
     * une redirection HTML (/login) et n’affiche pas les icônes « Ajouter à l’écran ».
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.webmanifest|robots\\.txt|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
