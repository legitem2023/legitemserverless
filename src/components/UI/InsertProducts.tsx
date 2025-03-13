import React, { useState } from "react";

const InsertProducts = () => {
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    type: string;
    brand: string;
    department: string;
    status: string;
  }>({
    name: "",
    category: "",
    type: "",
    brand: "",
    department: "",
    status: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const categoryOptions = ["Electronics", "Clothing", "Food"];
  const typeOptions = ["Retail", "Wholesale"];
  const brandOptions = ["Nike", "Apple", "Samsung"];
  const departmentOptions = ["HR", "Sales", "IT"];
  const statusOptions = ["Active", "Inactive"];

  const validateForm = () => {
    let newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        category: "",
        type: "",
        brand: "",
        department: "",
        status: "",
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
      </div>

      {[
        { label: "Category", name: "category", options: categoryOptions },
        { label: "Type", name: "type", options: typeOptions },
        { label: "Brand", name: "brand", options: brandOptions },
        { label: "Department", name: "department", options: departmentOptions },
        { label: "Status", name: "status", options: statusOptions },
      ].map(({ label, name, options }) => (
        <div key={name}>
          <label>{label}:</label>
          <select
            name={name}
            value={formData[name as keyof typeof formData]} // Ensure valid indexing
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors[name as keyof typeof formData] && (
            <div className="text-red-500 text-sm">{errors[name as keyof typeof formData]}</div>
          )}
        </div>
      ))}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button>
    </form>
  );
};

export default InsertProducts;
