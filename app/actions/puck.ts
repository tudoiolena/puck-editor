import { redirect } from 'react-router';
import { savePage } from '../lib/pages.server';

export async function action({ request, params }: { request: Request; params: Record<string, string | undefined> }) {
  const path = `/${params["*"] || ""}`;
  const formData = await request.formData();
  const dataString = formData.get("data") as string;
  
  if (dataString) {
    const data = JSON.parse(dataString);
    await savePage(path, data);
  }
  
  return redirect(path.replace("/puck", ""));
}

