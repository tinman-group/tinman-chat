import { Main } from "@/components/main-container";

export default async function PlaceholderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return (
    <Main.Content>
      <Main.Header>{slug}</Main.Header>
      <Main.Body>
        <p>TODO: Implement {slug} settings</p>
      </Main.Body>
    </Main.Content>
  );
}
