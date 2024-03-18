'use client'
import {login, signup} from './action'
import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box } from '@mantine/core';
export default  function Demo() {
    

    const form = useForm({
        initialValues: {
        email: '',
        password: '',
        },
    });


return (
    <Box maw={340} mx="auto">
            <form>
            <TextInput label="email" placeholder="" {...form.getInputProps('user')} />
            <TextInput mt="md" label="password" placeholder="" {...form.getInputProps('password')} />
            <Button mt="lg" fullWidth 
            onSubmit={async (event) => {
                event.preventDefault();
                await login(form.values.email, form.values.password);
            }}
            >
                            Submit</Button>
            </form>
    </Box>
);
}