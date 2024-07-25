import React, { useLayoutEffect } from 'react';
import { UserAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export function AuthRouteProvider({ children }: React.PropsWithChildren) {
  const { loggedIn } = UserAuth();

  useLayoutEffect(() => {
    if (!loggedIn) {
      redirect(`/`);
    }
  }, [loggedIn]);

  return <>{children}</>;
}
