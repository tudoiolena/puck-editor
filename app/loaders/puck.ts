import { redirect } from 'react-router';
import { resolvePage } from '../lib/pages.server';
import { getUserIdFromRequest } from '../lib/auth';

export async function loader({ request, params }: { request: Request; params: Record<string, string | undefined> }) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return redirect('/login');
  }

  const path = `/${params["*"] || ""}`;
  const data = await resolvePage(path, userId);
  
  return { data, path };
}


