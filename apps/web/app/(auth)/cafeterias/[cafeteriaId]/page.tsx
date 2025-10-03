import { CafeteriaDetailView } from "@/src/domains/cafeteria/detail/ui/views/cafeteria-detail-view";

interface PageProps {
  params: Promise<{
    cafeteriaId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { cafeteriaId } = await params;

  return <CafeteriaDetailView cafeteriaId={cafeteriaId} />;
};

export default Page;
