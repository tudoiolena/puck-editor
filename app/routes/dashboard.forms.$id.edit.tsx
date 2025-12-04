import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { useSubmit } from 'react-router';
import { redirect } from 'react-router';
import type { Route } from './+types/dashboard.forms.$id.edit';
import { config } from '../puck/config';
import { getUserIdFromRequest } from '../lib/auth';
import { getForm, saveFormContent } from '../lib/forms.server';
import { ROUTES } from '../constants/routes';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `Edit ${loaderData.form.title} - Form Builder` },
    { name: 'description', content: 'Edit your form with Puck' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formId = parseInt(params.id || '');

  if (isNaN(formId)) {
    return redirect(ROUTES.DASHBOARD);
  }

  const form = await getForm(formId, userId);

  if (!form) {
    return redirect(ROUTES.DASHBOARD);
  }

  return {
    form: {
      id: form.id,
      title: form.title,
      puckContent: form.puckContent,
    },
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formId = parseInt(params.id || '');

  if (isNaN(formId)) {
    return redirect(ROUTES.DASHBOARD);
  }

  const formData = await request.formData();
  const dataString = formData.get('data') as string;

  if (dataString) {
    const data = JSON.parse(dataString);
    await saveFormContent(formId, userId, data);
  }

  return redirect(ROUTES.DASHBOARD);
}

export default function FormEditor({ loaderData }: Route.ComponentProps) {
  const submit = useSubmit();

  return (
    <Puck
      config={config}
      data={loaderData.form.puckContent}
      onPublish={async (data) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        submit(formData, {
          method: 'POST',
        });
      }}
    />
  );
}
