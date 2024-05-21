export default interface BudgetPage {
    timeid: string
    startDate: Date
    endDate: Date
    budgetCategories: string[]
    nonBudgetCategories: string[]
    allocation: number
    actual: number
}