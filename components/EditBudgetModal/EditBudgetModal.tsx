import {useState, useEffect, use} from 'react';
import {Modal, Text, Select, NumberInput, Tabs, Paper, Switch,useMantineTheme,rem, Group, Grid, Button} from '@mantine/core' 
import { Category } from "@/types/category";
import { useSession } from "next-auth/react";
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {db} from '@/firebase';
import { getFirestore, collection, doc, setDoc,addDoc,getDocs,query,updateDoc, arrayUnion,where,getDoc } from "firebase/firestore";
import { Budget } from '@/types/budget';
import { redirect } from "next/navigation";


interface EditBudgetModalProps {
    opened: boolean;
    onClose: () => void;
    budget: Budget;
    setSelected:(item: Budget |undefined) => void;
}


export default function EditBudgetModal({opened, onClose, budget,setSelected}: EditBudgetModalProps) {
    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )

    

    const form = useForm({
        initialValues: {
            id: budget.id,
            value: budget.value,
            name: budget.name,
            categoryId: budget.categoryId,

        }
    })


    const theme = useMantineTheme();
    const getNextMonth = () => {
        const date = new Date();
        const nextMonth = new Date(date.getFullYear(),date.getMonth()+1,1)

        return nextMonth;
    }
    const [activeTab, setActiveTab] = useState<string |null> ('Weekly');
    const [weekly, setWeekly] = useState<string>('0');
    const [monthly, setMonthly] = useState<string>('1');
    const [yearly, setYearly] = useState<Date>(getNextMonth());
    const [custom, setCustom] = useState<Date>(getNextMonth());
    const [budgetType, setBudgetType] = useState<string>('1');
    console.log(activeTab)
    const handleEditBudget = async (budgetData: any) => {
        console.log(budgetData)
        const budgetRef = doc(db, "users", session.data?.user?.email as string, "budgets", budgetData.id);
        await updateDoc(budgetRef, {
            value: budgetData.value,
            name: budgetData.name,
            categoryId: budgetData.categoryId,
            type: budgetData.type,
            budgetType: budgetData.budgetType,
            time: budgetData.time
        });

        setSelected(undefined)
    }


    useEffect(() => {
        if (budget.type === 'Weekly') {
          setActiveTab(budget.type);
          setWeekly(budget.time as string);
        } else if (budget.type === 'Monthly') {
          setActiveTab(budget.type);
          setMonthly(budget.time as string);
        } else if (budget.type === 'Yearly') {
          setActiveTab(budget.type);
          setYearly(budget.time as Date);
        } else if (budget.type === 'Custom') {
          setActiveTab(budget.type);
          setCustom(budget.time as Date);
        }
      }, [budget]);

     const handleCloseModal = () => {
        
        setActiveTab('Weekly');
        setWeekly('0');
        setMonthly('1');
        setYearly(getNextMonth());
        setCustom(getNextMonth());
        form.reset()
        onClose();
    }
    return (
        <>
        <Modal opened={opened} onClose={onClose} title="Edit Budget">
            <form onSubmit={
                 form.onSubmit((values) => handleEditBudget(values)
                     .then(() =>{
                         handleCloseModal();
                         
                     }))}>
            <Tabs value={activeTab} onChange={
                (value) => {
                    setActiveTab(value);
                    
                }
        }>

            <Tabs.List>
                <Tabs.Tab value="Weekly">
                Weekly
                </Tabs.Tab>
                <Tabs.Tab value="Monthly" >
                Monthly
                </Tabs.Tab>
                <Tabs.Tab value="Yearly">
                Yearly
                </Tabs.Tab>
                <Tabs.Tab value="Custom">
                    Custom
                </Tabs.Tab>
            </Tabs.List>


            <Tabs.Panel value="Weekly">
            <NumberInput label="I need" required placeholder="Enter amount" 
            {...form.getInputProps('value')}
            />
            <Select label="Every" placeholder="Select day" required data={[
                { value: '0', label: 'Sunday' },
                { value: '1', label: 'Monday' },
                { value: '2', label: 'Tuesday' },
                { value: '3', label: 'Wednesday' },
                { value: '4', label: 'Thursday' },
                { value: '5', label: 'Friday' },
                { value: '6', label: 'Saturday' },
            ]} 
            value={weekly}
            onChange={
                (value) => {
                    setWeekly(value as string)
                    form.setFieldValue('time', value)
                }
            
            }
            
            />

            <Select label="Next week I want to" required placeholder="Select your option" 
                data = {[
                    {value: '1', label: `Refill up to ${form.values.value}$` ? `Refill up to ${form.values.value}$/week` : 'Refill up to 0$/week'},
                    {value: '2', label: `Set aside another ${form.values.value}$/month`}
                ]}
            value={budgetType}
            onChange={(value) => {
                setBudgetType(value as string)
                form.setFieldValue('budgetType', value)
            }}
            />




            
        </Tabs.Panel>
        
        <Tabs.Panel value="Monthly">
        <NumberInput label="I need" required placeholder="Enter amount" 
            {...form.getInputProps('value')}
            />
            <Select label="By" placeholder="Select date" required data={[
                {value: '1', label: '1st'},
                {value: '2', label: '2nd'},
                {value: '3', label: '3rd'},
                {value: '4', label: '4th'},
                {value: '5', label: '5th'},
                {value: '6', label: '6th'},
                {value: '7', label: '7th'},
                {value: '8', label: '8th'},
                {value: '9', label: '9th'},
                {value: '10', label: '10th'},
                {value: '11', label: '11th'},
                {value: '12', label: '12th'},
                {value: '13', label: '13th'},
                {value: '14', label: '14th'},
                {value: '15', label: '15th'},
                {value: '16', label: '16th'},
                {value: '17', label: '17th'},
                {value: '18', label: '18th'},
                {value: '19', label: '19th'},
                {value: '20', label: '20th'},
                {value: '21', label: '21st'},
                {value: '22', label: '22nd'},
                {value: '23', label: '23rd'},
                {value: '24', label: '24th'},
                {value: '25', label: '25th'},
                {value: '26', label: '26th'},
                {value: '27', label: '27th'},
                {value: '28', label: '28th'},
                {value: '29', label: '29th'},
                {value: '30', label: '30th'},
                {value: '31', label: '31st'},
                {value: '32', label: 'Last day of the month'}   
            ]} 
            value={monthly}
            onChange={(value) => {
                setMonthly(value as string)
                form.setFieldValue('time', value)
            }}
            />

            <Select label="Next month I want to" required placeholder="Select your option" 
                data = {[
                    {value: '1', label: `Refill up to ${form.values.value}$` ? `Refill up to ${form.values.value}$/month` : 'Refill up to 0$/month'},
                    {value: '2', label: `Set aside another ${form.values.value}$/month`}
                ]}
                value={budgetType}
                onChange={(value) => {
                    setBudgetType(value as string)
                    form.setFieldValue('budgetType', value)
                }}
            />

        </Tabs.Panel>
        <Tabs.Panel value="Yearly">
            <NumberInput label="I need" required placeholder="Enter amount" 
            {...form.getInputProps('value')}
            />
            <DatePickerInput label="By" placeholder="Select date" required 
            value={yearly}
            onChange={(value) => {
                setYearly(value as Date)
                form.setFieldValue('time', value)
            }}
            />
            
            <Select label="Next year I want to" required placeholder="Select your option" 
                data = {[
                    {value: '1', label: `Refill up to ${form.values.value}$/year` ? `Refill up to ${form.values.value}$/year` : 'Refill up to 0$/year'},
                    {value: '2', label: `Set aside another ${form.values.value}$/year`}
                ]}
                value={budgetType}
                onChange={(value) => {
                    setBudgetType(value as string)
                    form.setFieldValue('budgetType', value)}
                }
            />
        </Tabs.Panel>

        <Tabs.Panel value="Custom">
            <NumberInput label="I need" required placeholder="Enter amount"
            {...form.getInputProps('value')}
            />
            <DatePickerInput label="Due on" placeholder="Select date" 
            value={custom}
            onChange={(value) => {
                setCustom(value as Date)
                form.setFieldValue('time', value)
            }}
            />
            <Select label="I want to" required placeholder="Select your option" 
                data = {[
                    {value: '1', label: `Refill up to ${form.values.value}$/year` ? `Refill up to ${form.values.value}$/year` : 'Refill up to 0$/year'},
                    {value: '2', label: `Set aside another ${form.values.value}$/year`},
                    {value: '3', label: `Have a balance of ${form.values.value}$/year` ? `Have a balance of ${form.values.value}$` : 'Have a balance of 0$'},
                ]}
                value={budgetType}
                onChange={(value) => {
                    setBudgetType(value as string)
                    form.setFieldValue('budgetType', value)
                }}
/>
        </Tabs.Panel>
            
        </Tabs>

        <Grid justify='flex-end'>
                     <Button> Cancel </Button>
                     <Button type="submit" color="blue"
                     onClick={
                         () => {
                            form.setFieldValue('type',activeTab)
                            if (activeTab === 'Weekly') {
                                form.setFieldValue('time', weekly)
                                form.setFieldValue('budgetType', budgetType)
                            }
                            else if (activeTab === 'Monthly') {
                                form.setFieldValue('time', monthly)
                                form.setFieldValue('budgetType', budgetType)
                            }
                            else if (activeTab === 'Yearly') {
                                form.setFieldValue('time', yearly)
                                form.setFieldValue('budgetType', budgetType)
                            }
                            else if (activeTab === 'Custom') {
                                form.setFieldValue('time', custom)
                                form.setFieldValue('budgetType', budgetType)
                         }
                     }}> Edit Budget </Button>
        </Grid>
        </form>
        </Modal>
        </>
    )

}
