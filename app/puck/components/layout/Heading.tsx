import type { ComponentConfig } from "@measured/puck";
import type { UserConfig } from "../../types/config";

export const Heading: ComponentConfig<UserConfig["Heading"]> = {
  fields: {
    text: {
      type: "text" as const,
    },
    size: {
      type: "select" as const,
      options: [
        { label: "XL", value: "xl" },
        { label: "2XL", value: "2xl" },
        { label: "3XL", value: "3xl" },
        { label: "4XL", value: "4xl" },
        { label: "5XL", value: "5xl" },
      ],
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
    text: "Heading",
    size: "2xl" as const,
    align: "left" as const,
  },
  render: (props) => {
    const { text, size, align } = props;
    const sizeClasses: Record<string, string> = {
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    };
    return (
      <h2
        className={`${sizeClasses[size]} font-bold text-${align} text-gray-900 mb-2`}
      >
        {text}
      </h2>
    );
  },
};

