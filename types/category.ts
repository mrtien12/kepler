export interface Category {
    id: string
    category: string;
    // budgeted: number;
    spent: number;
    // available: number;  
    transactionids: string[];
    budgetid: string;
}