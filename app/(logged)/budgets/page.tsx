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
export default function Budget(){

    const notBudgetCategories = useNotBudgetCategory();
    const [openedAdd, Edithandler] = useDisclosure(false)
    const [selectCategory, setSelectCategory] = useState("")
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
            Edithandler.open();
        }
        console.log("Add Budget")
    }

    return (
    <>
        <Paper shadow="xl">
            <AddBudgetModal opened={openedAdd} onClose={Edithandler.close} categoryId={selectCategory}/>
            <NotBudgetTable 
                notBudgetCategories={notBudgetCategories}
                onAdd={handleAdd}
            />
        </Paper>
    </>
    )
}