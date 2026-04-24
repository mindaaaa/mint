import type { Preview } from '@storybook/react-vite';
import '../src/app/transport/web/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'workbench',
      values: [
        { name: 'workbench', value: '#F5F4EE' },
        { name: 'panel', value: '#FBFAF3' },
        { name: 'paper', value: '#FFFFFF' },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {},
  tags: ['autodocs'],
};

export default preview;
