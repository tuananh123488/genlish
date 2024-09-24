import React from 'react'

const Logo = ({ scale }) => {
    return (
        <div style={{ scale: scale ? scale : 1 }} className='flex items-end gap-1'>
            <img width={'35px'} src='/logo.png' />
            <span className='text-[23px] font-bold'>Genlish</span>
        </div>
    )
}

export default Logo