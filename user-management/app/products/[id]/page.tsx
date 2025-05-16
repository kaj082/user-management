"use client";
import { fetchProductById } from "@/src/actions/productAction";
import AppSkeleton from "@/src/component/appskeleton/AppSkeleton";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import styles from "../../../src/scss/ProductDetail.module.scss";
import { withAuth } from "@/src/hoc/withAuth";
import Loader from "@/src/component/loader/Loader";

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const getProduct = async () => {
      const { data, isSuccess } = await fetchProductById(id as string);
      if (!isSuccess || !data) {
        notFound();
        return;
      }
      setProduct(data);
    };

    getProduct();
  }, [id]);

  if (!product) return null;

  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <AppSkeleton>
        <section className={`max-w-6xl mx-auto px-4 py-8 ${styles.container}`}>
          <div className={styles.back}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => router.back()}
            >
              ←
            </button>
            <h2 className={styles.title}>{product?.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={300}
                height={300}
                className="rounded-lg w-full object-cover"
              />
              <div className="flex gap-4 mt-4 overflow-x-auto">
                {product.images.map((img: string, index: number) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Image ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded border hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className={styles.description}>{product.description}</p>
              <p className={styles.price}>
                ${product.price}{" "}
                <span className="line-through text-gray-400 ml-2">
                  $
                  {(product.price / (1 - product.discountPercentage)).toFixed(
                    2
                  )}
                </span>
              </p>
              <p className={styles.rating}>⭐ {product.rating} / 5</p>
              <p>
                <strong className={styles.label}>Stock:</strong> {product.stock}{" "}
                ({product.availabilityStatus})
              </p>
              <p>
                <strong className={styles.label}>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong className={styles.label}>Category:</strong>{" "}
                {product.category}
              </p>
              <p>
                <strong className={styles.label}>Minimum Order:</strong>{" "}
                {product.minimumOrderQuantity}
              </p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className={`${styles.box} p-4 rounded shadow-sm`}>
              <h3 className={styles.subTitle}>Shipping & Warranty</h3>
              <p>
                <strong className={styles.label}>Shipping:</strong>
                {product.shippingInformation}
              </p>
              <p>
                <strong className={styles.label}>Warranty:</strong>{" "}
                {product.warrantyInformation}
              </p>
            </div>

            <div className={`${styles.box} p-4 rounded shadow-sm`}>
              <h3 className={styles.subTitle}>Dimensions & Weight</h3>
              <p>
                <strong className={styles.label}>Dimensions:</strong>{" "}
                {product.dimensions.width}cm × {product.dimensions.height}cm ×{" "}
                {product.dimensions.depth}cm
              </p>
              <p>
                <strong className={styles.label}>Weight:</strong>{" "}
                {product.weight}
                kg
              </p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className={`${styles.box} p-4 rounded shadow-sm`}>
              <h3 className={styles.subTitle}>Return Policy</h3>
              <p>{product.returnPolicy}</p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={product.meta.qrCode}
                alt="QR Code"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className={styles.CustomerReviews}>Customer Reviews</h3>
            <div className="space-y-4">
              {product.reviews.map((review: any, i: number) => (
                <div key={i} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <p className={styles.reviewer}>{review.reviewerName}</p>

                    <p className={styles.date}>
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.reviewContent}>
                    <p className={styles.comment}>{review.comment}</p>
                    <p className={styles.rating}>⭐ {review.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AppSkeleton>
    </Suspense>
  );
};

export default withAuth(ProductDetail);
