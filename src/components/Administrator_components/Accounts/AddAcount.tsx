import React, { useState } from 'react';
import Titlebar from '@/components/UI/Titlebar';
import { showToast } from '../../../../utils/toastUtils';
import { Icon } from '@iconify/react/dist/iconify.js';
import usetoggleShowAdd from '../../../../store/usetoggleShowAdd';
const AddAccount = () => {
    const {isAddAccToggled, toggleAddAcc} = usetoggleShowAdd()

    return (
        <div className='left-0 top-0 w-[100vw] h-[100vh] bg-lime-950 fixed flex items-center justify-center z-50'>
            <div className='w-[50vw] p-1 flex flex-col items-center justify-center bg-[#f1f1f1] relative'>
                <Titlebar title="Add Item" Icons='gridicons:add' />
                <Icon icon='mdi:close' className='cursor-pointer text-black-500 bg-[#ff0000] text-3xl flex absolute top-0 right-0 border radius-[100%]' onClick={toggleAddAcc}/>
                <input
                    type='text'
                    className='p-2 m-1 w-full'
                    placeholder='Email Address'
                    required/>
                <input
                    type='password'
                    className='p-2 m-1 w-full'
                    placeholder='Password'
                    required/>
                <button className='bg-lime-700 text-white py-2 px-4 mt-2 flex flex-row justify-center items-center shadow-xs'>
                <Icon icon="gridicons:add" /> Add Account
                </button>
            </div>
        </div>
    );
}

export default AddAccount;
