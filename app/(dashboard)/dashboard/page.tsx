import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/DashboardScreen";

export const metadata: Metadata = {
  title: "Tableau de bord - FitForYou",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
