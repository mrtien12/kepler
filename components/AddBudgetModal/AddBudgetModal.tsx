import {useState, useEffect, use} from 'react';
import {Modal, Text, Select, NumberInput, Tabs, Paper, Switch,useMantineTheme,rem, Group, Grid, Button} from '@mantine/core' 
import { Category } from "@/types/category";
import { useSession } from "next-auth/react";
import { SpendingBudget, SavingsBudget, DebtPaymentBudget } from '@/types/budget';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {db} from '@/firebase';
import { getFirestore, collection, doc, setDoc,addDoc,getDocs,query,updateDoc, arrayUnion,where,getDoc } from "firebase/firestore";

import { redirect } from "next/navigation";

interface AddBudgetModalProps {
    opened: boolean;
    onClose: () => void;
    categoryId: string;
    name:string;
}

export default function AddBudgetModal({ opened, onClose, categoryId, name }: AddBudgetModalProps) {
    const theme = useMantineTheme();
    const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
    )    
    const [currentForm, setCurrentForm] = useState<string | null>('spending');
    const [value, setValue] = useState<string | number>(0);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
    const [checked, setChecked] = useState(false);
    const [frequency, setFrequency] = useState<{ type: string; value: string | Date }>({ type: 'Weekly', value: '' });
    const sunIcon = (
        <IconSun
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color={theme.colors.yellow[4]}
        />
    );

    const moonIcon = (
        <IconMoonStars
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color={theme.colors.blue[6]}
        />
    );

    const handleFrequencyChange = (type: string, value: string | Date | null) => {
        if (value === null) {
            // Handle null case if necessary, e.g., by setting a default value or ignoring the update.
            return;
        }
        setFrequency({ type, value });
        form.setFieldValue('frequency', { type, value });
    };
    // Reset the checked state when the modal is closed
    const handleCloseModal = () => {
        onClose();
        setCurrentForm('spending'); // Reset current form to spending
        setValue(0); // Reset value to 0
        setChecked(false); // Reset checked state to false
        form.reset()
    };  


    //make a useEffect to update the value of the categoryid


    const form = useForm({
        initialValues: {
            type: 'spending',
            value: 0
        }
    })
const addBudgettoFirestore = async (budgetData: any) => {
    console.log(budgetData)
    const categoryId = budgetData.categoryId;

    const newBudgetRef  = await addDoc(collection(db, 'users', session.data?.user?.email as string, 'budgets'), budgetData);

    const budgetId = newBudgetRef.id;

    const categoryRef = doc(db, 'users', session.data?.user?.email as string, 'categories', categoryId);


    const categorySnap = await getDoc(categoryRef);

    if (categorySnap.exists()) {
        const categoryData = categorySnap.data() as Category;
        const updatedCategoryData: Category = {
            ...categoryData,
            budgetid: budgetId
        }
        await setDoc(categoryRef, updatedCategoryData);
    
    }
}
    return (
        <>
            <Modal opened={opened} onClose={handleCloseModal} title="Add Budget">
            <form onSubmit={
                form.onSubmit((values) => addBudgettoFirestore(values)
                    .then(() =>{
                        handleCloseModal();
                    }))}>

                {/* <Text>{form.setValues('categoryId',categoryId)}</Text> */}
                <Select
                    label="Budget Type"
                    placeholder='Pick value'
                    allowDeselect={false}
                    data={[
                        { value: 'spending', label: 'Spending' },
                        { value: 'savings', label: 'Savings' },
                        { value: 'debt', label: 'Debt Payment' }
                    ]}
                    defaultValue="spending"
                    mt="md"
                    onChange={
                        (value) => {
                            form.getInputProps('type').onChange(value);
                            setCurrentForm(value);
                            form.reset()
                            form.setValues({'type': value!})
                        }
                    }  
                />
                <NumberInput
                    value={value} 
                    label="Spending Budget"
                    {...form.getInputProps('value')}
                />

                {currentForm === 'spending' &&
                    <Paper shadow='xl'>
                        <Tabs defaultValue="Weekly">
                            <Tabs.List>
                                <Tabs.Tab value="Weekly">
                                    Weekly
                                </Tabs.Tab>

                                <Tabs.Tab value='Monthly'>
                                    Monthly
                                </Tabs.Tab>

                                <Tabs.Tab value="Yearly">
                                    Yearly
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="Weekly">
                                <Select
                                    label="Every"
                                    allowDeselect={false}
                                    required
                                    placeholder={days[new Date().getDay()]}
                                    data={days.map((day) => ({ value: day, label: day }))}
                                    onChange={
                                        (value) => handleFrequencyChange('Weekly', value)
                                    }
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="Monthly">
                                <Select
                                    label="Every"
                                    placeholder={new Date().getDate().toString()}
                                    data={dates}
                                    onChange={
                                        (value) => handleFrequencyChange('Monthly', value)
                                    }

                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="Yearly">
                                <DatePickerInput
                                    label="First due on"
                                    placeholder={new Date().toDateString()}
                                    onChange={
                                        (value) => handleFrequencyChange('Yearly', value)
                                    }
                                />
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                }

                {
                    currentForm === 'savings' &&
                    <Paper shadow='xl'>

                        <Switch
                            label="By Date"
                            size="md"
                            color="dark.4"
                            onLabel={sunIcon}
                            offLabel={moonIcon}
                            checked={checked}
                            onChange={(event) => setChecked(event.currentTarget.checked)}

                        />
                    
                        {
                            checked &&
                            <Grid>
                                <Grid.Col span={8}>
                                    <MonthPickerInput
                                        label="Start Date"
                                        placeholder="Pick date"
                                        onChange={
                                            (value) =>{
                                                form.setFieldValue('date', value)
                                            }
                                        }
                                    />
                                </Grid.Col>


                            </Grid>
                        }
                    </Paper>
                }

                {
                    currentForm === 'debt' &&
                    <Paper shadow='xl'>
                        <MonthPickerInput
                            label="First Payment Date"
                            placeholder="Pick date"
                            onChange={
                                (value) =>{
                                    form.setFieldValue('date', value)
                                }
                            }
                        />
                    </Paper>
                }

                <Grid justify='flex-end'>
                    <Button onClick={handleCloseModal}> Cancel </Button>
                    <Button type="submit" color="blue"
                    onClick={
                        () => {
                            form.setFieldValue('categoryId', categoryId);
                            form.setFieldValue('name', name);
                        }
                    }
                    > Add Budget </Button>
                </Grid>
            </form>

            </Modal>
        </>
    )
}
