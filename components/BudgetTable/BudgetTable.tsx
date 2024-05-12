import { Card, Table, ActionIcon } from '@mantine/core';
import useSpent from '@/hooks/useSpent';
import { Budget } from '@/types/budget';
import ProgressBar from '@/components/ProgressBar/ProgressBar';

interface BudgetTableProps {
    budgetedCategory: Budget[];
    onEdit: (id: string) => void;
}

export default function BudgetTable({ budgetedCategory, onEdit }: BudgetTableProps) {
    const { categories, loading } = useSpent(budgetedCategory.map(budget => budget.categoryId));

    const handleEdit = (id: string) => {
        onEdit(id);
    };

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
                    <ActionIcon onClick={() => handleEdit(budget.categoryId)} />
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
