import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { useSelector } from "react-redux";
import Sortings from "./Sortings";

const EditProducts = () => {
  const name = useSelector((state: any) => state.category.name);
  console.log(name);
  const id = useSelector((state:any)=>state.category.id)
  const selectedCategory = useSelector((state:any)=>state.category.categories);
  const selectedType = useSelector((state:any)=>state.category.types);
  const selectedBrand = useSelector((state:any)=>state.category.brands);
  const selectedDepartment = useSelector((state:any)=>state.category.department);
  
  const [formData, setFormData] = useState({
    id:"",
    name: "",
    category: "",
    type: "",
    brand: "",
    department: "",
    status: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id: id || "",
      name: name || "", // Para maiwasan ang undefined error
      category:selectedCategory ||"",
      type: selectedType || "",
      brand: selectedBrand || "",
      department: selectedDepartment || "",
      status: "Active"
      
    }));
  }, [name]); // Trigger lang kapag nagbago ang `name`

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

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
        id:"",
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
    <>
      <BackButton />
      <form onSubmit={handleSubmit} className="bg-[#f1f1f1]">
        <div className="flex-1 flex flex-wrap relative p-2 font-bold">Edit Product</div>
        <hr />
        <div className="flex-1 flex flex-wrap relative p-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="border p-2 w-full text-[13px]"
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        </div>
        <div>
          <Sortings />
        </div>
        <div className="flex-1 flex flex-wrap relative p-2">
          <button type="submit" className="bg-[#451b05] text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default EditProducts;
