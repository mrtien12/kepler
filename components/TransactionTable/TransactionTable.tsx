import {Table} from '@mantine/core'
import { Transaction } from '@/types/transaction'
interface TransactionTableProps {
    transactions: Transaction[]
}
export default function TransactionTable({transactions} : TransactionTableProps) {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>Category</th>
                    <th>Memo</th>
                    <th>Outflow</th>
                    <th>Inflow</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.payee}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.memo}</td>
                        <td>{transaction.outflow}</td>
                        <td>{transaction.inflow}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
