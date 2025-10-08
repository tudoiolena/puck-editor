import { resolvePage } from '../lib/pages.server';

export async function loader({ params }: { params: Record<string, string | undefined> }) {
  const path = `/${params["*"] || ""}`;
  const data = await resolvePage(path);
  
  return { data, path };
}

