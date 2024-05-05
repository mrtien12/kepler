import React from 'react';
import { Card, Table, Button, ActionIcon } from '@mantine/core';
import { useNotBudgetCategory } from '@/hooks/useNotBudgetCategory';
import { Category } from '@/types/category';
import AddBudgetModal from '@/components/AddBudgetModal/AddBudgetModal'
import { useDisclosure } from '@mantine/hooks';
import {IconCirclePlus} from '@tabler/icons-react';
interface NotBudgetTableProps {
    notBudgetCategories:  any[],
    onAdd: (id: string) => void;
}
export default function NotBudgetTable({notBudgetCategories,onAdd}: NotBudgetTableProps){
    
    const handleAdd = (id: string) => {
        onAdd(id)
    }

    const rows = notBudgetCategories.map((category) => (

        <Table.Tr key={category.id}>
            <Table.Td>{category.category}</Table.Td>
            <Table.Td>{category.budgeted}</Table.Td>
            <Table.Td>{category.spent}</Table.Td>
            <Table.Td></Table.Td>
            <Table.Td>
                <ActionIcon onClick={() => handleAdd(category.id)}>
                    <IconCirclePlus size={24} />    
                 </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));                              
    return (
        <>
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Not Budgeted</Table.Th>
                    <Table.Th>Budgeted</Table.Th>
                    <Table.Th>Expense</Table.Th>
                    <Table.Th></Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}  
            </Table.Tbody>
        </Table>
        </>
    )
}