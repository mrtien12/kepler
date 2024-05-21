export interface Category {
    id: string
    category: string;
    spent: number;
    transactionids: string[];
    budgetid: string;
    startDate: Date;
}