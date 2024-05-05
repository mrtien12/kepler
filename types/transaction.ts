export interface Transaction {
    id: string;
    date: Date;
    category: string;
    memo: string;
    amount: number;
    type: string;
}