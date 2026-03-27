import type { ProfileGetPayload } from "@/app/generated/prisma/models/Profile";
import type { WeightEntryGetPayload } from "@/app/generated/prisma/models/WeightEntry";

export type Profile = ProfileGetPayload<{}>;
export type WeightEntry = WeightEntryGetPayload<{}>;

export interface ProfileViewProps {
  profile: Profile;
  email: string;
  weightHistory: WeightEntry[];
}
