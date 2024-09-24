'use client'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { handleFileUpload } from '@/utils/file'
import { formatDuration, parseISO8601Duration } from '@/utils/other'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

const Admin = () => {
    const [gates, setGates] = useState([])
    const { notifyHandler } = useContext(notifyContext)

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
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

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
        api({ type: TypeHTTP.GET, path: '/gate/get-all', sendToken: false, })
            .then(gates => setGates(gates))
    }, [])

    return (
        <section className='p-[1rem] flex flex-col gap-4'>
            <div className='w-full border-[1px] border-[#999] p-[1rem] flex flex-col gap-2'>
                <span>Quản Lý Ải Từ Vựng</span>
                <div className='grid grid-cols-2 gap-3'>
                    <input value={ai.title} onChange={e => setAi({ ...ai, title: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Tên Ải Từ Vựng' />
                    <input value={ai.level} onChange={e => setAi({ ...ai, level: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Level' />
                </div>
                <button onClick={() => handleCreateAi()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
            </div>
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
            <div className='w-full border-[1px] border-[#999] p-[1rem] flex flex-col gap-2'>
                <span>Quản Lý BroadCast</span>
                <div className='grid grid-cols-2 gap-3'>
                    <input type='file' onChange={e => handleFileChange(e, 'english')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                    <input type='file' onChange={e => handleFileChange(e, 'vietnam')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                    <input value={broadcast.urlVideo} onChange={e => setBroadcast({ ...broadcast, urlVideo: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='URL Video' />
                </div>
                <button onClick={() => handleCreateBroadCast()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
            </div>
        </section>
    )
}

export default Admin