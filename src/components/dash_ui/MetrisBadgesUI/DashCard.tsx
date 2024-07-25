import React from 'react';
import { ReactNode } from 'react';

function Dash_Card({
  classes,
  children,
}: {
  classes: string;
  children: ReactNode;
}) {
  return (
    <div
      className={classes}
      style={{
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}

export default Dash_Card;
