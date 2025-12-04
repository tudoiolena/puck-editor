import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const Card: ComponentConfig<UserConfig['Card']> = {
  fields: {
    title: {
      type: 'text' as const,
    },
    description: {
      type: 'textarea' as const,
    },
    icon: {
      type: 'text' as const,
    },
    mode: {
      type: 'radio' as const,
      options: [
        { label: 'Flat', value: 'flat' },
        { label: 'Card', value: 'card' },
      ],
    },
  },
  defaultProps: {
    title: 'Card Title',
    description: 'Card description',
    icon: '⭐',
    mode: 'card' as const,
  },
  render: (props) => {
    const { title, description, icon, mode } = props;
    return (
      <div
        className={`p-6 rounded-lg ${
          mode === 'card' ? 'bg-white shadow-lg border border-gray-100' : 'bg-transparent'
        }`}
      >
        {icon && <div className="text-4xl mb-4">{icon}</div>}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  },
};
