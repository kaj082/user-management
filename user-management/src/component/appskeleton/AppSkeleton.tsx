"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./AppSkeleton.module.scss";
import React from "react";
import Button from "../button/Button";
import Loader from "../loader/Loader";
import { useUserStore } from "@/src/store/userStore";

interface Props {
  children: React.ReactNode;
  ChildclassName?: string;
}

const AppSkeleton: React.FC<Props> = ({ children, ChildclassName }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const logout = useUserStore((state) => state.logout);

  const handleLogoClick = () => {
    setIsLoading(true);
    if (pathname === "/update-user") {
      router.push("/");
      setIsLoading(false);
    } else {
      router.push("/update-user");
      setIsLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setIsLoading(true);
    logout();
    router.push("/login");
    setIsLoading(false);
  };

  if (isLoading) return <Loader isLoading />;

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <div
          className={styles.logo}
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <span className={styles.name}>F</span>
          <span className={styles.name}>F</span>
        </div>

        <Button
          isLoading={isLoading}
          btnText="Logout"
          className={styles.logout}
          type="secondary"
          buttonProps={{ onClick: handleLogoutClick }}
        />
      </nav>

      <div className={`${styles.child} ${ChildclassName}`}>{children}</div>
    </main>
  );
};

export default AppSkeleton;
