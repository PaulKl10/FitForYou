import { EditSessionScreen } from "@/screens/EditSessionScreen";

export default async function EditSessionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <EditSessionScreen id={id} />;
}
