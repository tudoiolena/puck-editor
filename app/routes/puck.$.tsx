import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { useSubmit } from "react-router";

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
  const submit = useSubmit();
  
  return (
    <Puck
      config={config}
      data={loaderData.data}
      onPublish={async (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        
        submit(formData, {
          method: "POST",
        });
      }}
    />
  );
}

