'use client'
import { Text,Paper,Button } from "@mantine/core"
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker"
import { useInputState } from "@mantine/hooks"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useBudgetCategory } from "@/hooks/useBudgetCategory"
import useNotBudgetCategory from "@/hooks/useNotBudgetCategory"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { Budget } from "@/types/budget"
import AddBudgetModal from "@/components/AddBudgetModal/AddBudgetModal"
import DeleteBudgetModal from "@/components/DeleteBudgetModal/DeleteBudgetModal"
import EditBudgetModal from "@/components/EditBudgetModal/EditBudgetModal"
import BudgetTable from "@/components/BudgetTable/BudgetTable"
import NotBudgetTable from "@/components/NonBudgetTable/NonBudgetTable"
import { useEffect } from "react"
import parseTimeid from "@/utils/function/parseTimeid"
export default function BudgetByTime(
    {params} :{
        params: {timeid: string}
    }
) {
    const [timeid, setTimeid] = useInputState(params.timeid)

     const updateState = (newTimeid: string) => {
         setTimeid(newTimeid)
     }

    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        }
    });
    const notBudgetCategories = useNotBudgetCategory(timeid);
    const budgetedCategories = useBudgetCategory(timeid);
    const [openedAdd, Edithandler] = useDisclosure(false)
    const [openedEdit, EditBudgethandler] = useDisclosure(false)
    const [selectCategory, setSelectCategory] = useState("")
    const [selectBudget, setSelectBudget] = useState("")    
    const [openDeleteBudget, DeleteBudgethandler] = useDisclosure(false)
    const [selectCategoryName, setSelectCategoryName] = useState("")
    const [selectedBudget, setSelectedBudget] = useState<Budget>()
    const {startDate,endDate} = parseTimeid(timeid);

     const handleAdd = (id: string) => {
        const budgetToAdd = notBudgetCategories.find((category) => category.id === id);
        if (budgetToAdd) {
            setSelectCategory(budgetToAdd.id);
            setSelectCategoryName(budgetToAdd.category)
            Edithandler.open();
        }
        console.log("Add Budget")
    }

    const handleEdit = (id: string) => {
        const budgetToEdit = budgetedCategories.find((category) => category.id === id);
        console.log(budgetToEdit)
        if (budgetToEdit) {
            setSelectedBudget(budgetToEdit);
            EditBudgethandler.open();
        }
        console.log("Edit Budget")
    }

    const handleDelete = (id: string) => {
        const budgetToDelete = budgetedCategories.find((budget) => budget.id === id);
        console.log(budgetToDelete)
        if (budgetToDelete) {
            setSelectBudget(budgetToDelete.id);
            DeleteBudgethandler.open();
        }
        console.log("Delete Budget")
    }
    console.log("Budgeted Categories", budgetedCategories)
    return (
        <>
            <Text>Timeid: {timeid}</Text>
            <Paper shadow="xl">
            {selectCategory && <AddBudgetModal opened={openedAdd} onClose={Edithandler.close} categoryId={selectCategory} name={selectCategoryName} timestart={startDate}/>}
             <DeleteBudgetModal opened={openDeleteBudget} onClose={DeleteBudgethandler.close} budgetId={selectBudget}/>
              {selectedBudget && <EditBudgetModal setSelected={setSelectedBudget} opened={openedEdit} onClose={EditBudgethandler.close} budget ={selectedBudget}/>} 
             <BudgetTable 
                 budgetedCategory={budgetedCategories}
                 onEdit={handleEdit}
                 onDelete={handleDelete}
             />
             <NotBudgetTable 
                 notBudgetCategories={notBudgetCategories}
                 onAdd={handleAdd}
             />

            </Paper>
        </>
    )
 }