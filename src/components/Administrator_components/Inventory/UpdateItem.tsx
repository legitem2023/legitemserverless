import Select from '@/components/UI/Select';
import React, { useState } from 'react';
import CategoryJSON from '../../../../json/ProductType.json';
import ProductType from '../../../../json/ProductType.json';
import Titlebar from '@/components/UI/Titlebar';
import { showToast } from '../../../../utils/toastUtils';
import { Icon } from '@iconify/react/dist/iconify.js';
import usetoggleEditInv from '../../../../store/usetoggleEditInv';
import Image from 'next/image';
import legitem from '../../../../public/LegitemShield.png'
import noImage from '../../../../public/NoImage.png';

const UpdateItem = ({ product }: any) => {
    const [selectedOptionCategory, setSelectedOptionCategory] = useState<string>('');
    const [selectedOptionProductType, setSelectedOptionProductType] = useState<string>('');
    const [productCode, setProductCode] = useState<string>('');
    const [styleCode, setStyleCode] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [name, setName] = useState<string>('');
    const {toggleEdit } = usetoggleEditInv();

    const handleChangeCategory = (value: string) => {
        setSelectedOptionCategory(value);
    };

    console.log(product)

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
        value: item.category,
        label: item.category,
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
  

    const handleSubmit = async () => {
    };

    return (
        <div className='left-0 top-0 w-[100vw] h-[100vh] bg-lime-950 fixed flex items-center justify-center z-50'>
            <div className='w-[50vw] p-1 flex flex-col items-center justify-center bg-[#f1f1f1] relative'>
                <Titlebar title="Update Item" Icons='material-symbols:save' />
                <Icon icon='mdi:close' className='cursor-pointer text-black-500 bg-[#ff0000] text-3xl flex absolute top-0 right-0 border radius-[100%]' onClick={toggleEdit} />
                <div className='w-[100%] m-1 flex flex-col align-left justify-center'>
                    <Image src={product.thumbnail==='' || product.thumbnail===null?noImage:product.thumbnail} alt={product.name} width={200} height={200} className="m-1"/> 
                </div>                
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Product Code'
                    defaultValue={product.productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Style Code'
                    defaultValue={product.styleCode}
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
                    defaultValue={product.size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Color'
                    defaultValue={product.color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                />
                <input
                    type='number'
                    className='p-2 m-1 w-full'
                    placeholder='Price'
                    defaultValue={product.price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type='number'
                    className='p-2 m-1 w-full'
                    placeholder='Stock'
                    defaultValue={product.stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Name'
                    defaultValue={product.name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button className='bg-lime-700 text-white py-2 px-4 mt-2 flex flex-row justify-center items-center shadow-xs' onClick={handleSubmit}>
                <Icon icon="ic:sharp-save" /> Update
                </button>
            </div>
        </div>
    );
}

export default UpdateItem;
