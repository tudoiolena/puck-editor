/**
 * Puck configuration types
 */

export type UserConfig = {
  // Layout Components
  Hero: {
    title: string;
    description: string;
    align: "left" | "center";
    padding: string;
  };
  VerticalSpace: {
    size: string;
  };
  Heading: {
    text: string;
    size: "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    align: "left" | "center" | "right";
  };
  Text: {
    text: string;
    size: "sm" | "base" | "lg";
    align: "left" | "center" | "right";
    color: "default" | "muted";
  };
  ButtonGroup: {
    buttons: Array<{
      label: string;
      href: string;
      variant: "primary" | "secondary";
    }>;
    align: "left" | "center" | "right";
  };
  Columns: {
    columns: Array<{
      content: string;
    }>;
    distribution: "auto" | "manual";
  };
  Card: {
    title: string;
    description: string;
    icon?: string;
    mode: "flat" | "card";
  };
  Flex: {
    items: Array<{
      title: string;
      description: string;
    }>;
    minItemWidth: number;
  };
  // Form Components
  TextInput: {
    name: string;
    label: string;
    placeholder?: string;
    required: boolean;
    helperText?: string;
  };
  TextArea: {
    name: string;
    label: string;
    placeholder?: string;
    required: boolean;
    rows: number;
    helperText?: string;
  };
  EmailInput: {
    name: string;
    label: string;
    placeholder?: string;
    required: boolean;
    helperText?: string;
  };
  Select: {
    name: string;
    label: string;
    required: boolean;
    options: Array<{
      label: string;
      value: string;
    }>;
    helperText?: string;
  };
  RadioGroup: {
    name: string;
    label: string;
    required: boolean;
    options: Array<{
      label: string;
      value: string;
    }>;
  };
  CheckboxGroup: {
    name: string;
    label: string;
    required: boolean;
    options: Array<{
      label: string;
      value: string;
    }>;
  };
  SubmitButton: {
    label: string;
    align: "left" | "center" | "right";
  };
  FileUpload: {
    name: string;
    label: string;
    required: boolean;
    accept: string;
    maxSize: number;
    helperText?: string;
  };
};

