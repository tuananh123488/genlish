'use client'
import MoreInformation from '@/components/learn/MoreInformation'
import StudySchedule from '@/components/learn/StudySchedule'
import Navbar from '@/components/Navbar'
import { authContext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
const Learn = () => {

    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <section className='w-full h-screen flex'>
                <Navbar />
                <StudySchedule />
                <MoreInformation />
            </section>
        </motion.div>
    )
}

export default Learn