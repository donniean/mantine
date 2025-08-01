import { Autocomplete } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Autocomplete } from '@mantine/core';

function Demo() {
  return (
    <Autocomplete
      label="Your favorite library"
      placeholder="Pick value or enter anything"
      selectFirstOptionOnChange
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
`;

function Demo() {
  return (
    <Autocomplete
      label="Your favorite library"
      placeholder="Pick value or enter anything"
      selectFirstOptionOnChange
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}

export const selectFirstOptionOnChange: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
};
