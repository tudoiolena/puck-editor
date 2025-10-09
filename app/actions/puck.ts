import { redirect } from 'react-router';
import { savePage } from '../lib/pages.server';
import { getUserIdFromRequest } from '../lib/auth';

export async function action({ request, params }: { request: Request; params: Record<string, string | undefined> }) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return redirect('/login');
  }

  const path = `/${params["*"] || ""}`;
  const formData = await request.formData();
  const dataString = formData.get("data") as string;
  
  if (dataString) {
    const data = JSON.parse(dataString);
    await savePage(path, data, userId);
  }
  
  return redirect(path.replace("/puck", ""));
}

