"use client";

import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

type FormData = {
  color: string;
  size: string;
  price: number;
  stock: number;
  status: string;
  description: string;
};

export default function DetailedInsert() {
  const editorRef = useRef<any>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg">
      <div>
        <label className="block font-medium">Color</label>
        <input
          {...register("color", { required: "Color is required" })}
          className="border p-2 w-full"
        />
        {errors.color && <p className="text-red-500">{errors.color.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Size</label>
        <input
          {...register("size", { required: "Size is required" })}
          className="border p-2 w-full"
        />
        {errors.size && <p className="text-red-500">{errors.size.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Price</label>
        <input
          type="number"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be a positive number" },
          })}
          className="border p-2 w-full"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Stock</label>
        <input
          type="number"
          {...register("stock", {
            required: "Stock is required",
            min: { value: 0, message: "Stock must be a positive number" },
          })}
          className="border p-2 w-full"
        />
        {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <select
          {...register("status", { required: "Status is required" })}
          className="border p-2 w-full"
        >
          <option value="">Select status</option>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Discontinued">Discontinued</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <Editor
          apiKey="your-tinymce-api-key"
          onInit={(evt, editor) => (editorRef.current = editor)}
          onEditorChange={(content) => setValue("description", content, { shouldValidate: true })}
          init={{
            height: 200,
            menubar: false,
            plugins: "lists link image",
            toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
          }}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
}