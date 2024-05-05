import { Card, Table } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import React from 'react';

export interface DonutChartProps {
  name: string;
  value: number;
  color: string;
}

interface ExpenseCardProps {
  data: DonutChartProps[]; // Define the prop interface
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const totalPercentage = data.reduce((acc, item) => acc + (item.value / total) * 100, 0);

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

  const tableRows = data.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.value}</Table.Td>
      <Table.Td>{((item.value / total) * 100).toFixed(2)}%</Table.Td>
    </Table.Tr>
  ));

  const totalRow = (
    <Table.Tr>
      <Table.Td>Total</Table.Td>
      <Table.Td>{total}</Table.Td>
      <Table.Td>{totalPercentage.toFixed(2)}%</Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <Card shadow="xs" padding="md">
        <h1>Expense Card</h1>
        <Card.Section>
          <DonutChart tooltipDataSource="segment" strokeWidth={4} data={data} />
        </Card.Section>
      </Card>

      <Table>
        <Table.Tr>
          <Table.Th>Tag</Table.Th>
          <Table.Th>Expense</Table.Th>
          <Table.Th>Percentage</Table.Th>
        </Table.Tr>
        {tableRows}
        {totalRow}
      </Table>
    </>
  );
};

export default ExpenseCard;
