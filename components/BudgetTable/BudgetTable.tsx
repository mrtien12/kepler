import { Card, Table, ActionIcon } from '@mantine/core';
import useSpent from '@/hooks/useSpent';
import { Budget } from '@/types/budget';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { IconPencilBolt, IconTrash } from '@tabler/icons-react';
interface BudgetTableProps {
    budgetedCategory: Budget[];
    onEdit: (id: string) => void;
    onDelete : (id: string) => void;
}

export default function BudgetTable({ budgetedCategory, onEdit, onDelete }: BudgetTableProps) {
    const { categories, loading } = useSpent(budgetedCategory.map(budget => budget.categoryId));

    const handleEdit = (id: string) => {
        onEdit(id);
    };

    const handleDelete = (id: string) => {
        onDelete(id);
    }

    const rows = budgetedCategory.map(budget => {
        const spent = categories[budget.categoryId]?.spent || 0;
        const available = budget.value + spent;
        const progress = (- spent / budget.value) * 100;
        return (
            <Table.Tr key={`bud-${budget.categoryId}`}>
                <Table.Td>
                    {budget.name}
                    <ProgressBar value={progress} />
                </Table.Td>
                <Table.Td>{budget.value}</Table.Td>
                <Table.Td>{spent}</Table.Td>
                <Table.Td>{available}</Table.Td>
                <Table.Td>
                    <ActionIcon onClick={() => handleEdit(budget.id)}>
                        <IconPencilBolt />
                    </ActionIcon>
                </Table.Td>

                <Table.Td>
                    <ActionIcon onClick={() => handleDelete(budget.id)}>
                        <IconTrash />
                    </ActionIcon>
                </Table.Td>
                
            </Table.Tr>
        );
    });

    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Budgeted</Table.Th>
                        <Table.Th>Spent</Table.Th>
                        <Table.Th>Available</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
}
