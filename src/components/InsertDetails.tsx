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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md bg-[#f1f1f1]">
          <div className="flex-1 flex flex-wrap relative p-2 font-bold">Insert Product Detail</div>
          <hr></hr>
      <div className="flex-1 flex relative p-2">  
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="border p-2 w-full text-[13px]"
        />
        {errors.color && <p className="text-red-500">{errors.color}</p>}
      </div>

     <div className="flex-1 flex relative p-2">  
        
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={formData.size}
          onChange={handleChange}
          className="border p-2 w-full text-[13px]"
        />
        {errors.size && <p className="text-red-500">{errors.size}</p>}
      </div>

      <div className="flex-1 flex relative p-2">   
        
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full text-[13px]"
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}
      </div>

      <div className="flex-1 flex relative p-2">  
        
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="border p-2 w-full text-[13px]"
        />
        {errors.stock && <p className="text-red-500">{errors.stock}</p>}
      </div>

       <div className="flex-1 flex relative p-2">  
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full text-[13px]"
        >
          <option value="">Select status</option>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Discontinued">Discontinued</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status}</p>}
      </div>

       <div className="flex-1 flex relative p-2">  
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
