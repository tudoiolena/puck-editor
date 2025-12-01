import type { ComponentConfig } from "@measured/puck";
import type { UserConfig } from "../../types/config";

export const ButtonGroup: ComponentConfig<UserConfig["ButtonGroup"]> = {
  fields: {
    buttons: {
      type: "array" as const,
      arrayFields: {
        label: { type: "text" as const },
        href: { type: "text" as const },
        variant: {
          type: "select" as const,
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      defaultItemProps: {
        label: "Button",
        href: "#",
        variant: "primary" as const,
      },
    },
    align: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    buttons: [{ label: "Click me", href: "#", variant: "primary" as const }],
    align: "left" as const,
  },
  render: (props) => {
    const { buttons, align } = props;
    const alignClasses: Record<string, string> = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };
    return (
      <div className={`flex gap-2 ${alignClasses[align]}`}>
        {buttons.map((button: { label: string; href: string; variant: "primary" | "secondary" }, idx: number) => (
          <a
            key={idx}
            href={button.href}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              button.variant === "primary"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            {button.label}
          </a>
        ))}
      </div>
    );
  },
};

