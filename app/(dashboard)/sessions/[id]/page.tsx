import { SessionDetailScreen } from "@/screens/SessionDetailScreen";

export default async function SessionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <SessionDetailScreen id={id} />;
}
