"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import Loader from "../component/loader/Loader";

export function withAuth<P extends {}>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const currentUser = useUserStore((state) => state.currentUser);
    console.log(currentUser, "currentUser");
    const [hydrated, setHydrated] = React.useState(false);

    useEffect(() => {
      const unsub = useUserStore.persist.onHydrate(() => {
        setHydrated(true);
      });

      setHydrated(useUserStore.persist.hasHydrated());

      return () => {
        unsub();
      };
    }, []);

    useEffect(() => {
      if (hydrated && !currentUser) {
        router.replace("/login");
      }
    }, [hydrated, currentUser, router]);

    if (!hydrated) {
      return <Loader isLoading />;
    }

    if (!currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}
