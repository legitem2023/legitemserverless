"use client";

import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function InsertDetails() {
  const editorRef = useRef<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    price: "",
    stock: "",
    status: "",
    description: "",
  });

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Description Change (TinyMCE)
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // Form Validation
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.size) newErrors.size = "Size is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0)
      newErrors.stock = "Stock must be a positive number";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.description || formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg">
      <div>
        <label className="block font-medium">Color</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.color && <p className="text-red-500">{errors.color}</p>}
      </div>

      <div>
        <label className="block font-medium">Size</label>
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.size && <p className="text-red-500">{errors.size}</p>}
      </div>

      <div>
        <label className="block font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}
      </div>

      <div>
        <label className="block font-medium">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.stock && <p className="text-red-500">{errors.stock}</p>}
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select status</option>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Discontinued">Discontinued</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status}</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <Editor
          apiKey="your-tinymce-api-key"
          onInit={(evt, editor) => (editorRef.current = editor)}
          onEditorChange={handleEditorChange}
          init={{
            height: 200,
            menubar: false,
            plugins: "lists link image",
            toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
          }}
        />
        {errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
}