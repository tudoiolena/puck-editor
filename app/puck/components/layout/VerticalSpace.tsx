import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const VerticalSpace: ComponentConfig<UserConfig['VerticalSpace']> = {
  fields: {
    size: {
      type: 'select' as const,
      options: [
        { label: 'Small (16px)', value: '16px' },
        { label: 'Medium (32px)', value: '32px' },
        { label: 'Large (64px)', value: '64px' },
        { label: 'XLarge (96px)', value: '96px' },
      ],
    },
  },
  defaultProps: {
    size: '32px',
  },
  render: (props) => {
    const { size } = props;
    return <div style={{ height: size }} />;
  },
};
