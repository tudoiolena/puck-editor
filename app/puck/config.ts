/**
 * Puck configuration
 * Combines all components into a single config
 */
import type { Config } from "@measured/puck";
import type { UserConfig } from "./types/config";

// Import layout components
import {
  Hero,
  VerticalSpace,
  Heading,
  Text,
  ButtonGroup,
  Columns,
  Card,
  Flex,
} from "./components/layout";

// Import form components
import {
  TextInput,
  TextArea,
  EmailInput,
  Select,
  RadioGroup,
  CheckboxGroup,
  SubmitButton,
  FileUpload,
} from "./components/form";

export const config = {
  components: {
    // Layout Components
    Hero,
    VerticalSpace,
    Heading,
    Text,
    ButtonGroup,
    Columns,
    Card,
    Flex,
    // Form Components
    TextInput,
    TextArea,
    EmailInput,
    Select,
    RadioGroup,
    CheckboxGroup,
    SubmitButton,
    FileUpload,
  },
} satisfies Config<UserConfig>;

// Re-export types for convenience
export type { UserConfig } from "./types/config";

