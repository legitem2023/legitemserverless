"use client";

import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import BackButton from "./UI/BackButton";

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
    <>
      <BackButton />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto shadow-md bg-[#f1f1f1]">
        <div className="flex-1 flex flex-wrap relative p-2 font-bold">Insert Product Detail</div>
        <hr />

        <div className="flex-1 flex relative p-2">
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
            className="p-2 w-full text-[13px]"
          />
        </div>
        {errors.color && <p className="text-red-500 text-sm px-2">{errors.color}</p>}

        <div className="flex-1 flex relative p-2">
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleChange}
            className="p-2 w-full text-[13px]"
          />
        </div>
        {errors.size && <p className="text-red-500 text-sm px-2">{errors.size}</p>}

        <div className="flex-1 flex relative p-2">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="p-2 w-full text-[13px]"
          />
        </div>
        {errors.price && <p className="text-red-500 text-sm px-2">{errors.price}</p>}

        <div className="flex-1 flex relative p-2">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="p-2 w-full text-[13px]"
          />
        </div>
        {errors.stock && <p className="text-red-500 text-sm px-2">{errors.stock}</p>}

        <div className="flex-1 flex relative p-2">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 w-full text-[13px]"
          >
            <option value="">Select status</option>
            <option value="Active">Active</option>
            <option value="In-active">In-active</option>
          </select>
        </div>
        {errors.status && <p className="text-red-500 text-sm px-2">{errors.status}</p>}

        <div className="flex-1 flex relative p-2">
          <Editor
            apiKey="8uu57oloy4rinixs0tqfkwphgzagcs38v872pfyxnyt2awak"
            init={{
              plugins: [
                "anchor",
                "autolink",
                "charmap",
                "codesample",
                "emoticons",
                "image",
                "link",
                "lists",
                "media",
                "searchreplace",
                "table",
                "visualblocks",
                "wordcount",
                "checklist",
                "mediaembed",
                "casechange",
                "export",
                "formatpainter",
                "pageembed",
                "a11ychecker",
                "tinymcespellchecker",
                "permanentpen",
                "powerpaste",
                "advtable",
                "advcode",
                "editimage",
                "advtemplate",
                "ai",
                "mentions",
                "tinycomments",
                "tableofcontents",
                "footnotes",
                "mergetags",
                "autocorrect",
                "typography",
                "inlinecss",
                "markdown",
                "importword",
                "exportword",
                "exportpdf",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
                "link image media table mergetags | addcomment showcomments | spellcheckdialog " +
                "a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | " +
                "emoticons charmap | removeformat",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            }}
            initialValue="Welcome to TinyMCE!"
            onEditorChange={handleEditorChange}
          />
        </div>
        {errors.description && <p className="text-red-500 text-sm px-2">{errors.description}</p>}

        <div className="flex-1 flex relative p-2">
          <button
            type="submit"
            className="flex justify-center items-center p-2 rounded-md bg-[#451b05] text-[#ffffff] shadow-lg m-2"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}