"use client";
import React, { Suspense } from "react";
import Input from "@/src/component/input/Input";
import Button from "@/src/component/button/Button";

import styles from "../../src/scss/Login.module.scss";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/src/store/userStore";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import Loader from "@/src/component/loader/Loader";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const addUser = useUserStore((state) => state.addUser);

  const onSubmit = async (data: FormData) => {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      addUser({ ...data, password: hashedPassword });

      toast.success("User registered successfully", { position: "top-right" });
      router.push("/login");
    } catch (error) {
      console.error("Error in registration:", error);
      toast.error("Registration failed", { position: "top-right" });
    }
  };
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <section className={`${styles.container} py-4`}>
        <div className={styles.boxLogin}>
          <h1 className={styles.title}>Sign Up</h1>

          <form className={styles.box} onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              placeholder="First Name"
              inputProps={{
                ...register("firstName", {
                  required: "First name is required",
                }),
              }}
              error={errors.firstName?.message}
            />
            <Input
              type="text"
              placeholder="Last Name"
              inputProps={{
                ...register("lastName", { required: "Last name is required" }),
              }}
              error={errors.lastName?.message}
            />
            <Input
              type="email"
              placeholder="Email"
              inputProps={{
                type: "email",
                ...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }),
              }}
              className={styles.input}
              error={errors.email?.message}
            />
            <Input
              type="tel"
              placeholder="Phone"
              inputProps={{
                type: "tel",
                maxLength: 10,
                ...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                }),
              }}
              error={errors.phone?.message}
            />

            <Input
              type="string"
              placeholder="Password"
              className={styles.input}
              inputProps={{
                ...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,32}$/,
                    message:
                      "Password must have uppercase, lowercase, number and special char",
                  },
                }),
              }}
              error={errors.password?.message}
            />
            <Input
              type="string"
              placeholder="Confirm Password"
              inputProps={{
                ...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }),
              }}
              error={errors.confirmPassword?.message}
            />
            <Button
              isLoading={false}
              btnText="Sign Up"
              type="primary"
              className={styles.LoginBtn}
            />

            <div className={styles.account}>
              <div className={styles.line1}></div>
              <p className={styles.text2}>Already have an account?</p>
              <div className={styles.line2}></div>
            </div>
            <Button
              isLoading={false}
              type="secondary"
              btnText="Sign In"
              className={styles.SignupBtn}
              buttonProps={{
                onClick: () => router.push("/login"),
                type: "button",
              }}
            />
          </form>
        </div>
      </section>
    </Suspense>
  );
};

export default page;
