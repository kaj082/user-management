"use client";
import AppSkeleton from "@/src/component/appskeleton/AppSkeleton";

import styles from "../src/scss/Home.module.scss";
import { Suspense, useEffect, useState } from "react";
import { fetchProducts } from "@/src/actions/productAction";
import ProductDetailCard from "@/src/component/productDetailCard/ProductDetailCard";
import { Product } from "@/src/types";
import Link from "next/link";
import { withAuth } from "@/src/hoc/withAuth";
import Loader from "@/src/component/loader/Loader";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;
  const totalProducts = 194;
  const totalPages = Math.ceil(totalProducts / limit);
  useEffect(() => {
    setIsLoading(true);
    const loadProducts = async () => {
      const data = await fetchProducts(page * limit, limit);
      if (data.isSuccess) {
        setProducts(data.data);
        setIsLoading(false);
      }

      return () => {
        setIsLoading(false);
      };
    };

    loadProducts();
  }, [page]);

  const handlePrevClick = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextClick = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <AppSkeleton>
        <section className={styles.HomeContainer}>
          <h1 className={styles.title}>Products</h1>

          <div className={styles.container}>
            <ProductDetailCard
              variant="header"
              brandName="Brand"
              price={"Price"}
              rating={"Rating"}
              thumbnail="Thumbnail"
              category="Category"
              discountPer={"Discount"}
            />
            {isLoading && <div className={styles.loaderContainer}></div>}
            {products?.map((product, index) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <ProductDetailCard
                  brandName={product.brand}
                  category={product.category}
                  discountPer={product.discountPercentage}
                  price={product.price}
                  rating={product.rating}
                  thumbnail={product.thumbnail}
                />
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={`${styles.prev} ${page === 1 ? styles.disabled : ""}`}
              onClick={handlePrevClick}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className={`${styles.next} ${
                page === totalPages ? styles.disabled : ""
              }`}
              onClick={handleNextClick}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </section>
      </AppSkeleton>
    </Suspense>
  );
};
export default withAuth(Home);
