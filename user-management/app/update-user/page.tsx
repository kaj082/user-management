"use client";
import React, { Suspense, useEffect } from "react";
import styles from "../../src/scss/Update.module.scss";
import AppSkeleton from "@/src/component/appskeleton/AppSkeleton";
import Input from "@/src/component/input/Input";
import Button from "@/src/component/button/Button";
import { useRouter } from "next/navigation";
import { withAuth } from "@/src/hoc/withAuth";
import { useUserStore } from "@/src/store/userStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ChangePassword from "@/src/component/changePassword/ChangePassword";
import Loader from "@/src/component/loader/Loader";

type UpdateFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const page = () => {
  const router = useRouter();
  const [changePassword, setChangePassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });
  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
      });
    }
  }, [currentUser, reset]);

  const onSubmit = (data: UpdateFormInputs) => {
    if (!currentUser) return;
    setIsLoading(true);

    updateUser({
      ...currentUser,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: currentUser.password,
      id: currentUser.id,
    });

    toast.success("User updated successfully", { position: "top-right" });
    setIsLoading(false);
    router.push("/");
  };
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <AppSkeleton>
        <div className={styles.updateContainer}>
          <div className={styles.back}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => router.back()}
            >
              ←
            </button>
            <h2 className={styles.title}>Update Profile</h2>
          </div>
          <div className={styles.container}>
            <div className={styles.labelValue}>
              <p className={styles.label}>First Name</p>
              <div className={styles.input}>
                <Input
                  placeholder="First Name"
                  type="string"
                  inputProps={{
                    ...register("firstName", {
                      required: "First Name is required",
                    }),
                  }}
                  error={errors.firstName?.message}
                />
              </div>
            </div>
            <div className={styles.labelValue}>
              <p className={styles.label}>Last Name</p>
              <div className={styles.input}>
                <Input
                  placeholder="Last Name"
                  type="string"
                  inputProps={{
                    ...register("lastName", {
                      required: "Last Name is required",
                    }),
                  }}
                  error={errors.lastName?.message}
                />
              </div>
            </div>
            <div className={styles.labelValue}>
              <p className={styles.label}>Email</p>
              <div className={styles.input}>
                <Input
                  placeholder="Email"
                  type="string"
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
                  error={errors.email?.message}
                />
              </div>
            </div>
            <div className={styles.labelValue}>
              <p className={styles.label}>Phone</p>
              <div className={styles.input}>
                <Input
                  placeholder="Phone"
                  type="tel"
                  inputProps={{
                    ...register("phone", {
                      required: "Phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone number too short",
                      },
                    }),
                  }}
                  error={errors.phone?.message}
                />
              </div>
            </div>
            <Button
              btnText="Update"
              className={styles.update}
              type="primary"
              isLoading={false}
              buttonProps={{ onClick: handleSubmit(onSubmit) }}
            />

            <Button
              btnText="Change Password"
              className={styles.changePassword}
              type="primary"
              isLoading={false}
              buttonProps={{
                onClick: () => {
                  setChangePassword(true);
                },
              }}
            />
          </div>
          {
            <ChangePassword
              isVisible={changePassword}
              setIsVisible={setChangePassword}
            />
          }
        </div>
      </AppSkeleton>
    </Suspense>
  );
};

export default withAuth(page);
