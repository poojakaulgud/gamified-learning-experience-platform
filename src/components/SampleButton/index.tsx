import { ReactNode } from 'react';

const SampleButton = ({
  children,
  styles,
}: {
  children: ReactNode;
  styles?: string;
}) => <button className={styles}>{children}</button>;

export default SampleButton;
