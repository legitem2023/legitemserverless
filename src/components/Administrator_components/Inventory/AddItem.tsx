import Select from '@/components/UI/Select';
import React, { useState } from 'react';
import CategoryJSON from '../../../../json/ProductType.json';
import ProductType from '../../../../json/ProductType.json';
import Titlebar from '@/components/UI/Titlebar';
import useToggleStore from '../../../../store/usetoggle';
import { toast } from 'react-toastify';
import { showToast } from '../../../../utils/toastUtils';
import { Icon } from '@iconify/react/dist/iconify.js';

const AddItem = () => {
    const [selectedOptionCategory, setSelectedOptionCategory] = useState<string>('');
    const [selectedOptionProductType, setSelectedOptionProductType] = useState<string>('');
    const [productCode, setProductCode] = useState<string>('');
    const [styleCode, setStyleCode] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [name, setName] = useState<string>('');
    const { isToggled, toggle } = useToggleStore();

    const handleChangeCategory = (value: string) => {
        setSelectedOptionCategory(value);
    };

    const handleChangeProductType = (value: string) => {
        setSelectedOptionProductType(value);
    };

    const categorySet = new Set<string>();
    const distinctCategories = CategoryJSON.filter((item) => {
        if (!categorySet.has(item.category)) {
            categorySet.add(item.category);
            return true;
        }
        return false;
    });

    const CategoryOptions = distinctCategories.map((item) => ({
        "value": item.category,
        "label": item.category,
    }));

    const ProductTypeOptions = selectedOptionCategory === ''
    ? ProductType.map((item: any, index: number) => ({
        "value": `${item.type}-${index}`,  // Ensures unique value
        "label": item.type,
      }))
    : ProductType.filter((item: any) => item.category === selectedOptionCategory).map((item: any, index: number) => ({
        "value": `${item.type}-${index}`,  // Ensures unique value
        "label": item.type,
      }));
  
  
//*******************************************************************/
    const handleSubmit = async () => {
        // Check if all required fields are filled
        if (!productCode || !styleCode || !selectedOptionCategory || !selectedOptionProductType || !size || !color || !price || !stock || !name) {
            showToast('error', 'Please fill in all required fields.');
            return;
        }

        const payload = {
            productCode: productCode,
            styleCode: styleCode,
            category: selectedOptionCategory,
            productType: selectedOptionProductType,
            size: size,
            color: color,
            price: parseFloat(price),
            stock: parseInt(stock),
            name: name,
            creator: 'Robert Marquez', // replace with dynamic value if needed
            editor: 'Robert Marquez', // replace with dynamic value if needed
            accountCode: 'Em001', // replace with dynamic value if needed
        };
        try {
            const response = await fetch('/api/Mutation/InsertInventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                showToast('success', 'Item added successfully!');
                console.log('Success:', result);
                // Optionally, reset the form or handle success here
            } else {
                showToast('error', response.statusText);
                console.error('Error:', response.statusText);
                // Handle error response here
            }
        } catch (error:any) {
            showToast('error', error.message);
            console.error('Error:', error);
            // Handle network or unexpected errors here
        }
    };
//*******************************************************************/
    return (
        <div className='left-0 top-0 w-[100vw] h-[100vh] bg-lime-950 fixed flex items-center justify-center z-50'>
            <div className='w-[50vw] p-1 flex flex-col items-center justify-center bg-[#f1f1f1] relative'>
                <Titlebar title="Add Item" Icons='gridicons:add' />
                <Icon icon='mdi:close' className='cursor-pointer text-black-500 bg-[#ff0000] text-3xl flex absolute top-0 right-0 border radius-[100%]' onClick={toggle} />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Product Code'
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Style Code'
                    value={styleCode}
                    onChange={(e) => setStyleCode(e.target.value)}
                    required
                />
                <div className="w-[100%] m-1">
                    <Select
                        options={CategoryOptions}
                        value={selectedOptionCategory}
                        onChange={handleChangeCategory}
                        label="Select an Option"
                        placeholder="Select Category"
                        className="w-full"
                    />
                </div>
                <div className="w-[100%] m-1">
                    <Select
                        options={ProductTypeOptions}
                        value={selectedOptionProductType}
                        onChange={handleChangeProductType}
                        label="Select an Option"
                        placeholder="Select Product Type"
                        className="w-full"
                    />
                </div>
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Size'
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Color'
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                />
                <input
                    type='number'
                    className='p-2 m-1 w-full'
                    placeholder='Price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type='number'
                    className='p-2 m-1 w-full'
                    placeholder='Stock'
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button className='bg-lime-500 text-white py-2 px-4 mt-2' onClick={handleSubmit}>
                    Add
                </button>
            </div>
        </div>
    );
}

export default AddItem;
