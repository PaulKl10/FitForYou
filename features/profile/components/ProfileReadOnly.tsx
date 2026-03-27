import type { Profile } from "@/features/profile/types";

interface ProfileReadOnlyProps {
  profile: Profile;
}

export function ProfileReadOnly({ profile }: ProfileReadOnlyProps) {
  return (
    <div className="space-y-5 pt-2">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Prénom / Nom</p>
        <p className="text-sm text-muted-foreground">{profile.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Poids</p>
          <p className="text-sm text-muted-foreground">
            {profile.weight ? `${profile.weight} kg` : "—"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Taille</p>
          <p className="text-sm text-muted-foreground">
            {profile.height ? `${profile.height} cm` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
