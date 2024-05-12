'use client'
import { Paper } from "@mantine/core"
import { useAllCategory } from "@/hooks/useAllCategory"
import CategoryTable from "@/components/CategoryTable/CategoryTable"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useNotBudgetCategory } from "@/hooks/useNotBudgetCategory"
import NotBudgetTable from "@/components/NonBudgetTable/NonBudgetTable"
import AddBudgetModal from "@/components/AddBudgetModal/AddBudgetModal"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { useBudgetCategory } from "@/hooks/useBudgetCategory"
import BudgetTable from "@/components/BudgetTable/BudgetTable"
export default function Budget(){

    const notBudgetCategories = useNotBudgetCategory();
    const budgetedCategories = useBudgetCategory();
    console.log(budgetedCategories)
    const [openedAdd, Edithandler] = useDisclosure(false)
    const [openedEdit, EditBudgethandler] = useDisclosure(false)
    const [selectCategory, setSelectCategory] = useState("")
    const [selectBudget, setSelectBudget] = useState("")
    const [selectCategoryName, setSelectCategoryName] = useState("")
    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )

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
        if (budgetToEdit) {
            setSelectBudget(budgetToEdit.id);
            EditBudgethandler.open();
        }
        console.log("Edit Budget")
    }

    return (
    <>
        <Paper shadow="xl">
            <AddBudgetModal opened={openedAdd} onClose={Edithandler.close} categoryId={selectCategory} name={selectCategoryName}/>
            
            <BudgetTable 
                budgetedCategory={budgetedCategories}
                onEdit={handleEdit}
            />
            <NotBudgetTable 
                notBudgetCategories={notBudgetCategories}
                onAdd={handleAdd}
            />

            
        </Paper>
    </>
    )
}