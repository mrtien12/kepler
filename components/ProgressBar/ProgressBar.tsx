
import {Card, Progress} from '@mantine/core';

interface ProgressBarProps {
    value: number;
}
export default function ProgressBar({value}: ProgressBarProps) {
    if (value <= 100) {
        return (
        <Card shadow="xs" padding="md">
            <Progress value={value} animated={true}/>
        </Card>
        );
    }

    else {
        return (
            <Card shadow="xs" padding="md">
                <Progress value={100} color="red" animated={true}/>
            </Card>
        );
    }
    
}