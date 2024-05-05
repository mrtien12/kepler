'use client'

import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker"
import { useInputState } from "@mantine/hooks"
import CategoryTable from '@/components/CategoryTable/CategoryTable'
export default function DashboardBytime(
    {params} : {params: {timeid: string}}
) {


    const [timeid, setTimeid] = useInputState(params.timeid)
    const updateState = (newTimeid: string) => {
        setTimeid(newTimeid)
    }
    return (
        <>  
            
            <CustomDatePicker timeid={timeid} updateState={updateState}/>
            {/* <AddCategoryGroup /> */}
        </>  
    )
}