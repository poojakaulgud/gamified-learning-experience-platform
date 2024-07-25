import type { Meta, StoryObj } from '@storybook/react';

// import { YourComponent } from './YourComponent';
import SampleButton from './index';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof SampleButton> = {
  component: SampleButton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SampleButton>;

export const Primary: Story = {
  args: {
    //👇 The args you need here will depend on your component
    children: 'Hi Friends',
    styles: 'bg-blue-500 text-white p-4 rounded',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Hello Again',
    styles: 'bg-white border border-blue-500 text-blue-500 p-4 rounded',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Goodbye',
    styles: 'bg-blue-500 text-white p-4 rounded opacity-50 cursor-not-allowed',
  },
};
