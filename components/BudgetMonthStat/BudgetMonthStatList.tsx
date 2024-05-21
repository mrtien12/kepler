import { BudgetMonthStat } from './BudgetMonthStat';
import { Card, Stack } from '@mantine/core';
import classes from './BudgetMonthStatList.module.css';

interface BudgetMonthStatListProps {
  dataList: Array<{
    timeid: string;
    startDate: Date;
    endDate: Date;
    budgetCategories: string[];
    nonBudgetCategories: string[];
    allocation: number;
    actual: number;
  }>;
}

export function BudgetMonthStatList({ dataList }: BudgetMonthStatListProps) {
  if (dataList.length === 0) {
    return null; // Do not render if there is no data
  }
  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Stack>
        {dataList.map((data, index) => (
          <BudgetMonthStat key={index} data={data} />
        ))}
      </Stack>
    </Card>
  );
}
