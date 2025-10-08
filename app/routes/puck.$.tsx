import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import { config } from "../puck.config";
import type { Route } from "./+types/puck.$";

export { loader } from '../loaders/puck';
export { action } from '../actions/puck';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Puck Editor" },
    { name: "description", content: "Edit your page with Puck" },
  ];
}

export default function PuckEditor({ loaderData }: Route.ComponentProps) {
  return (
    <Puck
      config={config}
      data={loaderData.data}
      onPublish={async (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        
        await fetch(`/puck${loaderData.path}`, {
          method: "POST",
          body: formData,
        });
        
        // Redirect to the published page
        window.location.href = loaderData.path;
      }}
    />
  );
}

