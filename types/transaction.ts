export interface Transaction {
    id: string;
    date: string;
    payee: string;
    category: string;
    memo: string;
    outflow: number;
    inflow: number;
}