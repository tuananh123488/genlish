import { authContext } from '@/context/AuthContext';
import { notifyContext, notifyType } from '@/context/NotifyContext';
import { api, TypeHTTP } from '@/utils/api';
import React, { useContext, useState } from 'react'

const ChangePassword = ({ change, setChange }) => {
    const { authData, authHandler } = useContext(authContext);
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const { notifyHandler } = useContext(notifyContext)

    const handleChange = () => {
        notifyHandler.notify(notifyType.LOADING, 'Dang xac thuc')
        setOldPassword('')
        setNewPassword('')
        api({ path: '/user/updatePassword', body: { id: authData.user?._id, oldPassword: oldPassword, newPassword: newPassword }, sendToken: true, type: TypeHTTP.POST }).then(res => {
            notifyHandler.notify(notifyType.SUCCESS, 'Updatepassword thành công')
            globalThis.localStorage.removeItem('accessToken')
            globalThis.localStorage.removeItem('refreshToken')
            authHandler.setUser()
            notifyHandler.navigate('/')
        }).catch(e => {

            notifyHandler.notify(notifyType.FAIL, e.message.data)
        }

        )
    }
    return (
        <div style={{ right: change ? '0' : '-100%', transition: '0.5s' }} className='bg-[white] z-40 fixed top-0 w-[82%] gap-6 p-[1.5rem] h-screen overflow-y-auto justify-center  items-center flex flex-col'>
            <button onClick={() => setChange()} className='text-[35px] absolute top-3 right-4 text-[#999]'><i className='bx bx-x' ></i></button>
            <input value={oldPassword} type='password' onChange={(e) => setOldPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] w-[500px] px-4 mt-10 border border-[#e1e1e1]' placeholder='Nhập mật khẩu hiện tại' />
            <input value={newPassword} type='password' onChange={(e) => setNewPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] w-[500px] px-4 border border-[#e1e1e1]' placeholder='Nhập mật khẩu mới' />
            <button onClick={() => handleChange()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05]  w-[200px] transition-all bg-blue-400 text-white'>Đổi mật khẩu</button>
        </div>

    )
}

export default ChangePassword