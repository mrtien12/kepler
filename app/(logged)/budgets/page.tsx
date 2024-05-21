'use client'
import { Text,Paper, Button,ScrollArea } from "@mantine/core"
import { useAllCategory } from "@/hooks/useAllCategory"
import CategoryTable from "@/components/CategoryTable/CategoryTable"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import  useNotBudgetCategory  from "@/hooks/useNotBudgetCategory"
import NotBudgetTable from "@/components/NonBudgetTable/NonBudgetTable"
import AddBudgetModal from "@/components/AddBudgetModal/AddBudgetModal"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { useBudgetCategory } from "@/hooks/useBudgetCategory"
import DeleteBudgetModal from "@/components/DeleteBudgetModal/DeleteBudgetModal"
import  EditBudgetModal from "@/components/EditBudgetModal/EditBudgetModal"
import BudgetTable from "@/components/BudgetTable/BudgetTable"
import {Budget} from "@/types/budget"
import useAllBudget from "@/hooks/useAllBudget"
import { useEffect } from "react"
import { Month, MonthPickerInput } from "@mantine/dates"
import parseTimeid from "@/utils/function/parseTimeid"
import BudgetPage from "@/types/budgetPage"
import AddBudgetPage from "@/components/AddBudgetPage/AddBudgetPage"
import {BudgetMonthStatList} from "@/components/BudgetMonthStat/BudgetMonthStatList"
import useBudgetStat from "@/hooks/useBudgetStat"

export default function Budget(){


    //legacy code
    // const notBudgetCategories = useNotBudgetCategory();
    // const budgetedCategories = useBudgetCategory();
    // console.log(notBudgetCategories)
    // const [openedAdd, Edithandler] = useDisclosure(false)
    // const [openedEdit, EditBudgethandler] = useDisclosure(false)
    // const [selectCategory, setSelectCategory] = useState("")
    // const [selectBudget, setSelectBudget] = useState("")
    // const [openDeleteBudget, DeleteBudgethandler] = useDisclosure(false)
    // const [selectCategoryName, setSelectCategoryName] = useState("")
    // const [selectedBudget, setSelectedBudget] = useState<Budget>()
    // const session = useSession(
    //     {
    //         required: true,
    //         onUnauthenticated() {
    //             redirect('/signin');
    //         }
    //     }
    // )

    // const handleAdd = (id: string) => {
    //     const budgetToAdd = notBudgetCategories.find((category) => category.id === id);
    //     if (budgetToAdd) {
    //         setSelectCategory(budgetToAdd.id);
    //         setSelectCategoryName(budgetToAdd.category)
    //         Edithandler.open();
    //     }
    //     console.log("Add Budget")
    // }

    // const handleEdit = (id: string) => {
    //     const budgetToEdit = budgetedCategories.find((category) => category.id === id);
    //     console.log(budgetToEdit)
    //     if (budgetToEdit) {
    //         setSelectedBudget(budgetToEdit);
    //         EditBudgethandler.open();
    //     }
    //     console.log("Edit Budget")
    // }

    // const handleDelete = (id: string) => {
    //     const budgetToDelete = budgetedCategories.find((budget) => budget.id === id);
    //     console.log(budgetToDelete)
    //     if (budgetToDelete) {
    //         setSelectBudget(budgetToDelete.id);
    //         DeleteBudgethandler.open();
    //     }
    //     console.log("Delete Budget")
    // }


    // return (
    // <>
    //     <Paper shadow="xl">
    //         {selectCategory && <AddBudgetModal opened={openedAdd} onClose={Edithandler.close} categoryId={selectCategory} name={selectCategoryName}/>}
    //         <DeleteBudgetModal opened={openDeleteBudget} onClose={DeleteBudgethandler.close} budgetId={selectBudget}/>
    //          {selectedBudget && <EditBudgetModal setSelected={setSelectedBudget} opened={openedEdit} onClose={EditBudgethandler.close} budget ={selectedBudget}/>} 
    //         <BudgetTable 
    //             budgetedCategory={budgetedCategories}
    //             onEdit={handleEdit}
    //             onDelete={handleDelete}
    //         />
    //         <NotBudgetTable 
    //             notBudgetCategories={notBudgetCategories}
    //             onAdd={handleAdd}
    //         />

            
    //     </Paper>
    // </>
    // )

    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )
    const allCategories = useAllCategory();
    const allBudgets = useAllBudget();
    const budgetPages = useBudgetStat();
    const [time, setTime] = useState<Date | null>(new Date());
    console.log(allBudgets)
    return (
        <>
            
            <MonthPickerInput 
                value = {time}
                allowDeselect={false}
                defaultValue={new Date()}
                onChange={setTime}
            />
            <AddBudgetPage time={time}/>
            <ScrollArea>
                <BudgetMonthStatList dataList={budgetPages}/>
            </ScrollArea>
            {/* <BudgetMonthStat/> */}
        </>
    )
}