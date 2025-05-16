import React from "react";
import styles from "./ProductDetailCard.module.scss";
import Image from "next/image";

interface Props {
  thumbnail?: string;
  category: string;
  brandName: string;
  rating: number | string;
  price: number | string;
  discountPer: number | string;
  variant?: "row" | "header";
}

const ProductDetailCard = ({
  brandName,
  category,
  discountPer,
  price,
  rating,
  thumbnail,
  variant = "row",
}: Props) => {
  return (
    <div
      className={`${styles.row} ${variant === "header" ? styles.header : ""}`}
    >
      <div className={styles.box}>
        {variant === "row" && thumbnail && (
          <Image src={thumbnail} alt="thumbnail" width={64} height={64} />
        )}
        {variant === "header" && (
          <span className={styles.headerText}>Image</span>
        )}
      </div>
      <p className={styles.category}>{category}</p>
      <p className={styles.brandName}>{brandName}</p>
      <p className={styles.rating}>{rating}</p>
      <p className={styles.price}>{price}</p>
      <p className={styles.discountPer}>{discountPer}</p>
    </div>
  );
};

export default ProductDetailCard;
