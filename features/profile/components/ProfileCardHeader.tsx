import { Camera, Pencil } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarPickerModal } from "@/features/profile/components/AvatarPickerModal";
import type { Profile } from "@/types";

interface ProfileCardHeaderProps {
  profile: Profile;
  email: string;
  isEditing: boolean;
  selectedAvatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  onEdit: () => void;
}

export function ProfileCardHeader({
  profile,
  email,
  isEditing,
  selectedAvatarUrl,
  onAvatarChange,
  onEdit,
}: ProfileCardHeaderProps) {
  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayUrl = isEditing ? selectedAvatarUrl : profile.avatarUrl;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {isEditing ? (
          <AvatarPickerModal selectedUrl={selectedAvatarUrl} onSelect={onAvatarChange}>
            <button
              type="button"
              aria-label="Changer l'avatar"
              className="relative size-18 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Avatar className="size-18 ring-2 ring-primary/20">
                {displayUrl ? (
                  <Image
                    src={displayUrl}
                    alt={profile.name}
                    width={72}
                    height={72}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <AvatarFallback className="text-xl font-bold bg-primary/15 text-primary">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <Camera className="size-5 text-white" />
              </span>
            </button>
          </AvatarPickerModal>
        ) : (
          <Avatar className="size-18 ring-2 ring-primary/20">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt={profile.name}
                width={72}
                height={72}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <AvatarFallback className="text-xl font-bold bg-primary/15 text-primary">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        )}
        <div>
          <p className="text-lg font-bold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      {!isEditing && (
        <Button variant="outline" size="icon-lg" aria-label="Modifier le profil" onClick={onEdit}>
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  );
}
