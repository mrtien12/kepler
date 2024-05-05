'use client'
import ExpenseCard from '@/components/ExpenseCard/ExpenseCard'
import {Center, Grid} from '@mantine/core'
import { useAllTransactions } from '@/hooks/useAllTransaction'
import { DonutChartProps } from '@/components/ExpenseCard/ExpenseCard'
export default function Insights() {

    const startDate = new Date(2024, 4, 1)
    const endDate = new Date(2024, 4,30)
    const transactions = useAllTransactions(startDate,endDate)
    //create data here with transactions.category, and category amount 
    const generateColors = () => {
        const colors = [];
        for (let i = 0; i < 20; i++) {
          const hue = ((360 / 20) * i) % 360; // Ensure hue is spread evenly
          const color = `hsl(${hue}, 70%, 50%)`; // Generate HSL color
          colors.push(color);
        }
        return colors;
      };
    const palette = generateColors();
    const data: DonutChartProps[] = transactions.map((transaction,index) => ({
        name: transaction.category,
        value: -transaction.amount,
        color: palette[index % palette.length]

    }))

    console.log(data)
        
    return (
        <>  
        <Grid>
            <Grid.Col span={6}>
                    <ExpenseCard data={data}/>
            </Grid.Col>
        </Grid> 
        </>  
    )
}