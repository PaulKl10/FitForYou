import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types";

interface ProfileEditFormProps {
  profile: Profile;
  avatarUrl: string | null;
  isPending: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ profile, avatarUrl, isPending, onSubmit, onCancel }: ProfileEditFormProps) {
  return (
    <form action={onSubmit} className="space-y-5 h-full">
      <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">
          Prénom / Nom
        </Label>
        <Input id="name" name="name" defaultValue={profile.name} required />
      </div>

      <div className="flex flex-col gap-4 justify-between h-full">
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
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" disabled={isPending} onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </Button>
        </div>
      </div>
    </form>
  );
}
