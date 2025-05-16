import React, { useEffect, useState } from "react";
import Input from "../input/Input";
import Button from "../button/Button";
import styles from "./ChangePassword.module.scss";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { useUserStore } from "@/src/store/userStore";
import { set, useForm } from "react-hook-form";
interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const ChangePassword = (props: Props) => {
  const { isVisible, setIsVisible } = props;
  const { currentUser, users, setCurrentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
    if (!isVisible) reset();
  }, [isVisible, reset]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser) {
      toast.error("No current user found");
      return;
    }

    setIsLoading(true);

    const user = users.find((u) => u.email === currentUser.email);
    if (!user) {
      toast.error("User not found");
      setIsLoading(false);
      return;
    }

    const isCorrect = await bcrypt.compare(data.currentPassword, user.password);
    if (!isCorrect) {
      setError("currentPassword", {
        type: "manual",
        message: "Current password is incorrect",
      });
      setIsLoading(false);
      return;
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, password: hashedPassword } : u
    );

    setCurrentUser({ ...currentUser, password: hashedPassword });
    useUserStore.setState({ users: updatedUsers });

    toast.success("Password changed successfully");
    setIsLoading(false);
    reset();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    isVisible && (
      <div className={styles.changePassword}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.container}
        >
          <h2>Change Password</h2>
          <Input
            type="text"
            inputProps={{
              ...register("currentPassword", {
                required: "Current password is required",
              }),
              onChange: () => clearErrors("currentPassword"),
            }}
            placeholder="Current password"
            error={errors.currentPassword?.message}
          />
          <Input
            type="text"
            placeholder="New password"
            inputProps={{
              ...register("newPassword", {
                required: "New password is required",

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
              onChange: () => clearErrors("newPassword"),
            }}
            error={errors.newPassword?.message}
          />
          <Input
            type="text"
            placeholder="Confirm new password"
            inputProps={{
              ...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              }),
              onChange: () => clearErrors("confirmPassword"),
            }}
            error={errors.confirmPassword?.message}
          />
          <div className="flex items-center justify-between gap-32">
            <Button
              isLoading={false}
              btnText="Cancel"
              className="w-fit"
              type="secondary"
              buttonProps={{
                onClick: () => {
                  reset();
                  setIsVisible(false);
                },
                disabled: isLoading,
              }}
            />
            <Button
              isLoading={false}
              btnText="Save"
              className="w-fit"
              type="primary"
              buttonProps={{
                type: "submit",
                disabled: isLoading,
              }}
            />
          </div>
        </form>
      </div>
    )
  );
};

export default ChangePassword;
