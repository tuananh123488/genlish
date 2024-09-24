'use client'
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authContext } from "./AuthContext";
export const studyContext = createContext()

const StudyProvider = ({ children }) => {

    const [doors, setDoors] = useState([])
    const [gates, setGates] = useState([])
    const { authData } = useContext(authContext)

    useEffect(() => {
        if (authData.user) {
            api({ type: TypeHTTP.GET, path: '/gate/get-all', sendToken: false, })
                .then(gates => setGates(gates))
        }
    }, [authData.user])

    useEffect(() => {
        if (gates.length > 0) {
            api({ sendToken: false, path: `/door/get-by-gate/${gates[0]._id}`, type: TypeHTTP.GET })
                .then(doors => setDoors(doors))
        }
    }, [gates])

    const data = {
        doors,
        gates
    }

    const handler = {
        setDoors,
        setGates
    }

    return (
        <studyContext.Provider value={{ studyData: data, studyHandler: handler }}>
            {children}
        </studyContext.Provider >
    )
}

export default StudyProvider
