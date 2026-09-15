import { Editor } from "@/components/studio/Editor";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Editor id={id} />;
}
