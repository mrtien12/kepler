import classes from './DebtSimulator.module.css';
import { Modal, NumberInput } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useForm } from '@mantine/form';
import {Text,Grid, Button} from '@mantine/core';
import {MonthPickerInput} from '@mantine/dates';

interface DebtSimulatorModalProps {
    opened: boolean;
    onClose: () => void;
}


export function DebtSimulator({opened, onClose}: DebtSimulatorModalProps) {
    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )
    
    const handleClose = () => {
        onClose();
    }

    const form = useForm({
        initialValues: {
            amount : 0,
            interest: 0,
            minimumPayment: 0,
            PayoffDate: Date,
            monthlyPayment: 0
        }
    });
    return (
        <Modal size="xl" opened={opened} onClose={handleClose} title="Debt simulator">
            <Grid columns={4}>
                <Grid.Col span={1}>
                    <Text>Amount</Text>
                    <NumberInput />
                    <Text>Interest</Text>
                    <NumberInput />
                    <Text>Minimum Payment</Text>
                    <NumberInput />
                    <Text>Payoff Date</Text>
                    <MonthPickerInput />

                </Grid.Col>
                <Grid.Col span={3}>
                    <h1>Debt Simulator</h1>
                </Grid.Col>
            </Grid>
        <Button> Done </Button>
        </Modal>
    )
}