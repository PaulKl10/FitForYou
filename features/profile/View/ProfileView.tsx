"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/features/profile/services/profile";
import { ProfileCardHeader } from "@/features/profile/components/ProfileCardHeader";
import { ProfileReadOnly } from "@/features/profile/components/ProfileReadOnly";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { WeightChart } from "@/features/profile/components/WeightChart";
import { BmiSection } from "@/features/profile/components/BmiSection";
import type { ProfileViewProps } from "@/features/profile/types";

export function ProfileView({
  profile,
  email,
  weightHistory,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(
    profile.avatarUrl ?? null,
  );
  const [isPending, startTransition] = useTransition();

  function handleEdit() {
    setSelectedAvatarUrl(profile.avatarUrl ?? null);
    setIsEditing(true);
  }

  function handleCancel() {
    setSelectedAvatarUrl(profile.avatarUrl ?? null);
    setIsEditing(false);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData);
      setIsEditing(false);
    });
  }

  const showStats =
    weightHistory.length > 0 || (!!profile.weight && !!profile.height);

  return (
    <div className="flex flex-col gap-8">
      {/* En-tête de page */}
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Compte
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground mt-1">Gérer tes informations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Section 1 — Informations */}
        <Card className="border-border/60 w-full h-fit">
          <CardHeader>
            <ProfileCardHeader
              profile={profile}
              email={email}
              isEditing={isEditing}
              selectedAvatarUrl={selectedAvatarUrl}
              onAvatarChange={setSelectedAvatarUrl}
              onEdit={handleEdit}
            />
          </CardHeader>
          <Separator className="opacity-50" />
          <CardContent>
            {isEditing ? (
              <ProfileEditForm
                profile={profile}
                avatarUrl={selectedAvatarUrl}
                isPending={isPending}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileReadOnly profile={profile} />
            )}
          </CardContent>
        </Card>
        {/* Section 2 — Suivi (si données disponibles) */}
        {showStats && (
          <div className="space-y-4 w-full">
            {weightHistory.length > 0 && (
              <Card className="border-border/60">
                <CardContent>
                  <p className="text-sm font-semibold mb-3">
                    Évolution du poids
                  </p>
                  <WeightChart weightHistory={weightHistory} />
                </CardContent>
              </Card>
            )}
            {profile.weight && profile.height && (
              <BmiSection weight={profile.weight} height={profile.height} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
