import { useState } from 'react';
export function FilterCheckBox({
  name,
  id,
  handleChange,
}: {
  name?: string;
  id?: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div className="mb-5">
      <input
        type="checkbox"
        name={name}
        data-id={id}
        checked={isChecked}
        value={name}
        className="mr-2 rounded checked:bg-[]"
        onClick={() => setIsChecked(!isChecked)}
        onChange={(e) => handleChange(e)}
      />
      <label className="text-sm" htmlFor={name}>
        {name}
      </label>
    </div>
  );
}
