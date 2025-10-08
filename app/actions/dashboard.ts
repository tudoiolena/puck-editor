import { redirect } from 'react-router';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get('action') as string;

  if (action === 'logout') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': 'auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      },
    });
  }

  return null;
}
