import { Text, Card, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import classes from './BudgetMonthStat.module.css';
import convertTimeid from "@/utils/function/convertTimeid";
import { DonutChart } from '@mantine/charts';

interface BudgetMonthStatProps {
  data: {
    timeid: string;
    startDate: Date;
    endDate: Date;
    budgetCategories: string[];
    nonBudgetCategories: string[];
    allocation: number;
    actual: number;
  };
}

export function BudgetMonthStat({ data }: BudgetMonthStatProps) {
  const date = convertTimeid(data.timeid);
  const router = useRouter();

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const handleButtonClick = () => {
    router.push(`/budgets/${data.timeid}`);
  };

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <div className={classes.container}>
        <DonutChart
          className={classes.chart}
          data={[
            { value: data.actual, name: 'Actual', color: 'blue' },
            { value: data.allocation, name: 'Allocation', color: 'gray' },
          ]}
        />
        <div className={classes.statsContainer}>
          <Text fz="xs" tt="uppercase" fw={800} className={classes.title}>
            {date}
          </Text>
          <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
            Non-budget categories: {data.nonBudgetCategories.length}
          </Text>
          <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
            Budget categories: {data.budgetCategories.length}
          </Text>
          <Text fz="lg" fw={500} className={classes.stats}>
            Allocation: ${data.allocation}
          </Text>
          <Text fz="lg" fw={500} className={classes.stats}>
            Spent: ${data.actual}
          </Text>
          <div className={classes.buttonContainer}>
            <Button onClick={handleButtonClick}>Open Budget</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
