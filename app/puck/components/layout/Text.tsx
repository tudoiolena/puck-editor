export const Text = {
  fields: {
    text: {
      type: 'textarea' as const,
    },
    size: {
      type: 'select' as const,
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'Large', value: 'lg' },
      ],
    },
    align: {
      type: 'radio' as const,
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    color: {
      type: 'radio' as const,
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted', value: 'muted' },
      ],
    },
  },
  defaultProps: {
    text: 'Text content',
    size: 'base' as const,
    align: 'left' as const,
    color: 'default' as const,
  },
  render: (props) => {
    const { text, size, align, color } = props;
    const sizeClasses: Record<string, string> = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    };
    const colorClasses: Record<string, string> = {
      default: 'text-gray-900',
      muted: 'text-gray-600',
    };
    return (
      <p
        className={`${sizeClasses[size]} ${colorClasses[color]} text-${align} whitespace-pre-wrap`}
      >
        {text}
      </p>
    );
  },
};
