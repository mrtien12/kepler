import {Table,Button,Flex} from '@mantine/core'
import { Transaction } from '@/types/transaction'
interface TransactionTableProps {
    transactions: Transaction[],
    onEdit: (id: string) => void,
    onDelete: (id: string) => void
}
export default function TransactionTable({transactions,onEdit,onDelete} : TransactionTableProps) {

    const handleEdit = (id: string) => {
        onEdit(id)
    }

    const handleDelete = (id: string) => {
        onDelete(id)
    }

    const rows = transactions.map((transaction) => (
        <Table.Tr key={transaction.id}>
            <Table.Td>{transaction.date.getDate() + "/" + (transaction.date.getMonth() + 1) + "/" + transaction.date.getFullYear() }</Table.Td>
            <Table.Td>{transaction.category}</Table.Td>
            <Table.Td>{transaction.memo}</Table.Td>
            <Table.Td>{transaction.amount}</Table.Td>
            <Table.Td>
                <Flex gap="md">
                    <Button size="xs" variant="outline" onClick={() => handleEdit(transaction.id)}>Edit</Button>
                    <Button size="xs" variant="outline" onClick={() => handleDelete(transaction.id)}>Delete</Button>
                </Flex>
                
            </Table.Td>
        </Table.Tr>
        
    ));
    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Memo</Table.Th>
                        <Table.Th>Amount</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
        </>
    )
}
