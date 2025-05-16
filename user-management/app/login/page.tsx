"use client";
import Button from "@/src/component/button/Button";
import React, { Suspense } from "react";
import styles from "../../src/scss/Login.module.scss";
import Input from "@/src/component/input/Input";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/userStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import Loader from "@/src/component/loader/Loader";

interface LoginFormInputs {
  email: string;
  password: string;
}

const page = () => {
  const router = useRouter();
  const users = useUserStore((state) => state.users);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  console.log(users, "users");

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    const user = users.find((u) => u.email === data.email);
    console.log(user, "user");

    if (!user) {
      toast.error("Invalid email or password", { position: "top-right" });
      setIsLoading(false);
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );

    if (isPasswordCorrect) {
      setCurrentUser(user);
      toast.success("Login successful", { position: "top-right" });
      router.push("/");
    } else {
      toast.error("Invalid email or password", { position: "top-right" });
    }

    setIsLoading(false);
  };

  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <section className={styles.container}>
        <div className={styles.boxLogin}>
          <h1 className={styles.title}>Login</h1>

          <form className={styles.box} onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="Email"
              inputProps={{
                type: "email",
                ...register("email", { required: true }),
              }}
              className={styles.input}
              error={errors.email?.message}
            />
            <Input
              type="string"
              placeholder="Password"
              className={styles.input}
              inputProps={{
                type: "string",
                ...register("password", { required: true }),
              }}
              error={errors.password?.message}
            />
            <Button
              isLoading={isLoading}
              btnText="Login"
              type="primary"
              className={styles.LoginBtn}
            />

            <div className={styles.account}>
              <div className={styles.line1}></div>
              <p className={styles.text2}>Don’t have an account?</p>
              <div className={styles.line2}></div>
            </div>
            <Button
              isLoading={false}
              type="secondary"
              btnText="Sign Up"
              className={styles.SignupBtn}
              buttonProps={{ onClick: () => router.push("/register") }}
            />
          </form>
        </div>
      </section>
    </Suspense>
  );
};

export default page;
