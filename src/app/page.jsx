'use client'
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import FourthSection from "@/components/publicPage/FourthSection";
import SecondSection from "@/components/publicPage/SecondSection";
import ThirdSection from "@/components/publicPage/ThirdSection";
import { authContext } from "@/context/AuthContext";
import { notifyContext } from "@/context/NotifyContext";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {
  const { notifyHandler } = useContext(notifyContext)
  const { authHandler } = useContext(authContext)

  return (
    <section className="flex flex-col item-center justify-center">
      <div className="h-screen py-3 flex flex-col px-[10%]">
        <div className="flex items-end justify-between">
          <Logo />
          <span className="font-semibold text-[16px] text-[#595959]">Ngôn ngữ hiển thị: Tiếng Việt</span>
        </div>
        <div className="flex items-center justify-between mt-[2rem] gap-4">
          <img src="/couple.png" className="w-[50%] animate-slight-move" />
          <div className="flex flex-col gap-2 w-[45%] items-center">
            <span className="text-center text-[25px] font-semibold">Cách học tiếng Anh miễn phí, vui nhộn, và hiệu quả</span>
            <button onClick={() => { notifyHandler.navigate('/getting-started') }} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[60%] py-[7px] rounded-lg">Bắt Đầu</button>
            <button onClick={() => authHandler.showSignIn()} className="bg-[white] hover:scale-[1.06] transition-all text-[#149dff] shadow-xl border-[1px] border-[#e4e4e4] font-bold text-[16px] w-[60%] py-[7px] rounded-lg">Tôi Đã Có Tài Khoản</button>
          </div>
        </div>
      </div>
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <Footer />
    </section>
  );
}
