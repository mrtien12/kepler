// budget.ts

// Base type for all budget types
export type Budget = {
    id: string
    name: string;
    categoryId: string;
    value: number,
    type: string,
    budgetType: string,
    time : string | Date
    timestart: Date ; 
};


