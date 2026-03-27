import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/features/profile/services/profile";
import type { ProfileViewProps } from "@/types";

export function ProfileView({ profile, email }: ProfileViewProps) {
  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Compte
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground mt-1">Gérer tes informations</p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-18 ring-2 ring-primary/20">
              {profile.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              )}
              <AvatarFallback className="text-xl font-bold bg-primary/15 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        <CardContent>
          <form
            key={`${profile.name}-${profile.weight}-${profile.height}`}
            action={updateProfile}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Prénom / Nom
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={profile.name}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold">
                  Poids
                </Label>
                <div className="relative">
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={profile.weight ?? ""}
                    placeholder="70"
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    kg
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-semibold">
                  Taille
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="1"
                    defaultValue={profile.height ?? ""}
                    placeholder="175"
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    cm
                  </span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sauvegarder les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
