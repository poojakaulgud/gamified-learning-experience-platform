import { ReactNode } from 'react';

// create paper card that will accept children
export const Card = ({
  classes,
  children,
}: {
  classes: string;
  children: ReactNode;
}) => <div className={`${classes} shadow-xl`}>{children}</div>;
