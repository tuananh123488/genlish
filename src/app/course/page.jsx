'use client'
import Navbar from '@/components/Navbar'

import React from 'react'
import { motion } from 'framer-motion'
const Course = () => {
    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <section className='w-full h-screen flex'>
                <Navbar />

                <div className=' w-[82%] p-[1.5rem] h-screen overflow-y-auto'>
                    <div className='text-2xl'>Các khóa học</div>
                    <div className='grid grid-cols-3  gap-8 p-[1.5rem] h-screen overflow-y-auto'>


                        <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden h-56 flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-poppins font-semibold text-2xl tracking-wide'>
                            Tiếng Anh Cơ Bản
                        </div>
                        <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden h-56 flex justify-center items-center bg-gradient-to-r from-green-400 to-teal-500 text-white font-poppins font-semibold text-2xl tracking-wide'>
                            Tiếng Anh Trung Cấp
                        </div>
                        <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden h-56 flex justify-center items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 font-poppins font-semibold text-2xl tracking-wide'>
                            Tiếng Anh Nâng cao
                        </div>
                        <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden h-56 flex justify-center items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 font-poppins font-semibold text-2xl tracking-wide'>
                            Tiếng Anh Nâng cao
                        </div>

                    </div>
                </div>


            </section>
        </motion.div>
    )
}

export default Course