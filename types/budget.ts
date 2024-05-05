// budget.ts

// Base type for all budget types
export type Budget = {
    categoryId: string;
    value:number
};

// Enum to define the frequency of spending
export type SpendingFrequency = {
    type: string;
    value: string | Date ;

}

// Type for spending budgets
export type SpendingBudget = Budget & {
    type: 'spending';
    frequency: SpendingFrequency;  // How often the expense occurs (weekly, monthly, yearly)
};

// Type for savings budgets
export type SavingsBudget = Budget & {
    type: 'savings';
    date: Date; // Date by which the savings goal should be met
}
// Type for debt payment budgets
export type DebtPaymentBudget = Budget & {
    type: 'debt';
    date: Date; // Date by which the debt should be paid off
};
