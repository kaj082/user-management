// utils/fetchProducts.ts
import axios from "axios";
import { toast } from "react-toastify";

export const fetchProducts = async (skip: number = 0, limit: number = 10) => {
  try {
    const response = await axios.get("https://dummyjson.com/products", {
      params: { skip, limit },
    });

    toast.success("Products fetched successfully", {
      position: "top-right",
      autoClose: 3000,
    });

    return {
      isSuccess: true,
      data: response.data.products,
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);

    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load products",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    return {
      isSuccess: false,
      data: [],
    };
  }
};

export const fetchProductById = async (id: number | string) => {
  try {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);

    return {
      isSuccess: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching product:", error);

    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch product",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    return {
      isSuccess: false,
      data: null,
    };
  }
};
