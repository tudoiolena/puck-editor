import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const SubmitButton: ComponentConfig<UserConfig['SubmitButton']> = {
  fields: {
    label: { type: 'text' as const, label: 'Button Label' },
    align: {
      type: 'radio' as const,
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  },
  defaultProps: {
    label: 'Submit',
    align: 'left' as const,
  },
  render: (props) => {
    const { label, align } = props;
    const alignClasses: Record<string, string> = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };
    return (
      <div className={`flex ${alignClasses[align]} mb-4`}>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          {label}
        </button>
      </div>
    );
  },
};
