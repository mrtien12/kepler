import React, { use, useState } from 'react';
import { Button, Grid, ActionIcon,} from "@mantine/core";
import { MonthPickerInput } from '@mantine/dates';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { MonthPicker } from '@mantine/dates';
import {useInputState} from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function CustomDatePicker(params: {timeid:string, updateState: (newTimeid: string) => void   }) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
        const year = parseInt(params.timeid.substring(0,4));
        const month = parseInt(params.timeid.substring(4));
        
        const date = new Date(year, month - 1);
        setCurrentDate(date);
    },[params.timeid])


    const navigateAndUpdateState = (newDate: Date) => {
        const newTimeid = `${newDate.getFullYear()}${newDate.getMonth() + 1}`;
        params.updateState(newTimeid); // Update parent component state
        router.replace(`/dashboard/${newTimeid}`); // Navigation
    };

    const onClickLeft = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
        navigateAndUpdateState(newDate);
    }

    const onClickRight = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
        navigateAndUpdateState(newDate);

    }

    const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    // console.log(monthYear)
    return (
        <>
            <Grid>
                <ActionIcon size="xl" color="blue" radius="xl" variant="outline" onClick={onClickLeft}>
                    <IconChevronLeft />
                </ActionIcon>
                <MonthPickerInput 
                    value={currentDate}
                    onChange={(date) => {
                        if(date){
                            setCurrentDate(date)
                            navigateAndUpdateState(date)
                        }
                    
                    }}
                    
                    
                /> 
                <ActionIcon size="xl" color="blue" radius="xl" variant="outline" onClick={onClickRight}>
                    <IconChevronRight />
                </ActionIcon>
            </Grid>
        </>
    );
}
