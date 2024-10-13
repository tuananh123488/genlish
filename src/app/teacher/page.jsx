'use client'


import Logo from '@/components/Logo'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { handleFileUpload } from '@/utils/file'
import { formatDuration, parseISO8601Duration } from '@/utils/other'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

const Teacher = () => {
    const [gates, setGates] = useState([])
    const { notifyHandler } = useContext(notifyContext)
    const [broadcasts, setBroadCasts] = useState([])
    const { authData, authHandler } = useContext(authContext)

    const [ai, setAi] = useState({
        title: '',
        level: ''
    })

    const [broadcast, setBroadcast] = useState({
        vietnameseFile: null,
        englishFile: null,
        urlVideo: ''
    })

    const [cua, setCua] = useState({
        gate: null,
        individual: {
            title: '',
            image: '',
            numberOfTest: '',
            color: '',
            door: ''
        },
        beginner: [],
        elementary: [],
        intermediate: [],
        upperIntermediate: [],
        advanced: [],
    })

    const handleCreateAi = () => {
        api({ type: TypeHTTP.POST, sendToken: false, body: { ...ai }, path: '/gate/save' })
            .then(gate => {
                setGates(prev => [...prev, gate]);
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }
    const [option, setOption] = useState('a')
    const handleCreateCua = () => {
        api({ type: TypeHTTP.POST, sendToken: false, body: { ...cua }, path: '/door/save-or-update' })
            .then(door => {
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    const handleCreateBroadCast = async () => {
        const formData = new FormData()
        formData.append('strs', broadcast.englishFile)
        formData.append('strs', broadcast.vietnameseFile)
        console.log(broadcast.englishFile, broadcast.vietnameseFile);


        const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${broadcast.urlVideo}&key=${'AIzaSyDBJ0uR3jcjnJDB3BOZYW8eJvIkGVFjdlw'}&part=snippet,contentDetails,statistics,status`)
        const title = res.data.items[0].snippet.title
        const thum = res.data.items[0].snippet.thumbnails.maxres.url
        const duration = formatDuration(parseISO8601Duration(res.data.items[0].contentDetails.duration)).replace('00:', '')
        const channelName = res.data.items[0].snippet.channelTitle
        formData.append('urlVideo', broadcast.urlVideo);
        formData.append('title', title)
        formData.append('thum', thum)
        formData.append('duration', duration)
        formData.append('channelName', channelName)
        api({ sendToken: false, type: TypeHTTP.POST, path: '/broadcast/save', body: formData })
            .then(broadcast => {
                setBroadCasts(prev => [...prev, broadcast])
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    const handleFileChange = (e, type) => {
        const selectedFile = e.target.files[0]; // Lấy file đầu tiên từ danh sách file
        if (selectedFile) {
            if (type === 'vietnam') {
                setBroadcast({ ...broadcast, vietnameseFile: selectedFile })
            } else {
                setBroadcast({ ...broadcast, englishFile: selectedFile })
            }
        }
    };

    useEffect(() => {

        api({ type: TypeHTTP.GET, path: '/gate/get-all', sendToken: false })
            .then(gates => setGates(gates))


    }, [])
    useEffect(() => {
        () => setOption('a')
    }, [])
    const handleSignOut = () => {
        globalThis.localStorage.removeItem('accessToken')
        globalThis.localStorage.removeItem('refreshToken')
        authHandler.setUser()
        notifyHandler.navigate('/')
    }



    const handleDelete = (gateId) => {
        api({ type: TypeHTTP.DELETE, path: `/gate/delete/${gateId}`, sendToken: false, })
            .then((gate) => {

                setGates(gates.filter(item => item._id.toLowerCase() !== gate._id.toLowerCase()));
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa thành công')
            })
    }
    useEffect(() => {
        api({ type: TypeHTTP.GET, path: '/broadcast/get-all', sendToken: false })
            .then(broadcasts => setBroadCasts(broadcasts))
    }, [])
    const handleRemoveBroadcast = (id) => {


        api({ path: `/broadcast/delete/${id}`, type: TypeHTTP.DELETE, sendToken: false })
            .then(res => {
                setBroadCasts(broadcasts.filter(item => item._id.toLowerCase() !== res._id.toLowerCase()))
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa thành công')

            })
    }
    return (
        <section className='w-full h-screen flex'>
            <section className='w-[18%] px-[1.5rem] py-[1.25rem] border-r-[2px] border-[#f4f4f4]'>
                <Logo />

                <div className='flex flex-col gap-2 mt-[1rem]'>

                    <div onClick={() => setOption('a')} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg h-[40px] px-2 w-[100%] items-center gap-4 cursor-pointer'>
                        <img src='/radio-menu.png' className='w-[32px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Quản lý ải</span>
                    </div>

                    <div onClick={() => setOption('b')} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg h-[40px] px-2 w-[100%] items-center gap-4 cursor-pointer'>
                        <img src='/radio-menu.png' className='w-[32px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Quản lý cửa</span>
                    </div>

                    <div onClick={() => setOption('c')} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg h-[40px] px-2 w-[100%] items-center gap-4 cursor-pointer'>
                        <img src='/radio-menu.png' className='w-[32px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Quản lý broadcast</span>
                    </div>
                    <div onClick={() => setOption('d')} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg h-[40px] px-2 w-[100%] items-center gap-4 cursor-pointer'>
                        <img src='/radio-menu.png' className='w-[32px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Quản lý khóa học</span>
                    </div>
                    <div onClick={() => handleSignOut()} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg h-[40px] px-2 w-[100%] items-center gap-4 cursor-pointer'>
                        <img src='/logout-menu.png' className='w-[32px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Đăng Xuất</span>
                    </div>
                </div>
            </section>
            <div className=' w-[82%] p-[1.5rem] h-screen overflow-y-auto'>
                {
                    option === 'a' ? (
                        <div className='w-full  p-[1rem] flex flex-col gap-2'>
                            <span>Quản Lý Ải Từ Vựng</span>
                            <div className='grid grid-cols-2 gap-3'>
                                <input value={ai.title} onChange={e => setAi({ ...ai, title: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Tên Ải Từ Vựng' />
                                <input value={ai.level} onChange={e => setAi({ ...ai, level: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Level' />
                            </div>
                            <button onClick={() => handleCreateAi()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
                            <span className='my-4 text-[20px]' > Danh sách ải</span>
                            <div className="overflow-y-auto h-64 border border-gray-300 rounded-md p-4">
                                {gates.map((gate, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md">
                                        <span>{gate.title}</span>
                                        <span className="text-gray-500">{gate.level}</span>
                                        <button
                                            onClick={() => handleDelete(gate._id)} // Assuming each gate has a unique ID
                                            className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : option === 'b' ? (
                        <div className='w-full border-[1px] border-[#999] p-[1rem] flex flex-col gap-2'>
                            <span>Quản Lý Cửa Từ Vựng</span>
                            <div className='grid grid-cols-2 gap-3'>
                                <select onChange={e => setCua({ ...cua, gate: { _id: e.target.value.split('-')[0], title: e.target.value.split('-')[1], level: e.target.value.split('-')[2] } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]'>
                                    <option>Chọn Ải Từ Vựng</option>
                                    {gates.map((gate, index) => (
                                        <option key={index} value={gate._id + '-' + gate.title + '-' + gate.level}>{gate.title}</option>
                                    ))}
                                </select>
                                <input value={cua.individual.title} onChange={e => setCua({ ...cua, individual: { ...cua.individual, title: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Tên Cửa Từ Vựng' />
                                <input value={cua.individual.image} onChange={e => setCua({ ...cua, individual: { ...cua.individual, image: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Ảnh Cửa Từ Vựng' />
                                <input value={cua.individual.numberOfTest} onChange={e => setCua({ ...cua, individual: { ...cua.individual, numberOfTest: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Số Bài Kiểm Tra' />
                                <input value={cua.individual.color} onChange={e => setCua({ ...cua, individual: { ...cua.individual, color: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Màu Sắc' />
                                <input value={cua.individual.door} onChange={e => setCua({ ...cua, individual: { ...cua.individual, door: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Cửa' />
                                <span className='font-bold'>Beginner (excel)</span>
                                <span className='font-bold'>Elementary (excel)</span>
                                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, beginner: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, elementary: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <span className='font-bold'>Intermediate (excel)</span>
                                <span className='font-bold'>UpperIntermediate (excel)</span>
                                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, intermediate: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, upperIntermediate: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <span className='font-bold'>Advanced (excel)</span>
                                <div></div>
                                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, advanced: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <div></div>
                            </div>
                            <button onClick={() => handleCreateCua()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
                        </div>
                    ) : option === "c" ? (
                        <div className='w-full  p-[1rem] flex flex-col gap-2'>
                            <span>Quản Lý BroadCast</span>
                            <div className='grid grid-cols-2 gap-3'>
                                <input type='file' onChange={e => handleFileChange(e, 'english')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <input type='file' onChange={e => handleFileChange(e, 'vietnam')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                                <input value={broadcast.urlVideo} onChange={e => setBroadcast({ ...broadcast, urlVideo: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='URL Video' />
                            </div>

                            <button onClick={() => handleCreateBroadCast()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
                            <span className='my-4 text-[20px]' > Danh sách broadcast</span>
                            <div className='overflow-y-scroll h-[350px]'>{broadcasts.map((broadCast, index) => (
                                <div key={index} className='rounded-md cursor-pointer overflow-hidden flex  bg-white shadow-xl m-2' style={{ alignItems: 'center' }} >
                                    <img src={broadCast.thum} width={'15%'} />
                                    <div className='py-1 flex justify-between w-3/5'>
                                        <span
                                            className='font-poppins font-semibold text-[15px] my-2 px-2'>{broadCast.title}
                                        </span>
                                        <span
                                            className='font-poppins font-semibold text-[15px] my-2 px-2'>
                                            {broadCast.duration}
                                        </span>
                                    </div>

                                    <div onClick={() => handleRemoveBroadcast(broadCast._id)} className=" hover:text-red-400 px-4 py-2 cursor-pointer rounded-lg ">
                                        Delete
                                    </div>


                                </div>
                            ))}</div>
                        </div>
                    ) : option === "d" ? (
                        <div className='w-full border-[1px] border-[#999] p-[1rem] flex flex-col gap-2'>
                            <span>Quản Lý Khóa học</span>

                        </div>
                    ) : null
                }



            </div>

        </section>
    )
}

export default Teacher