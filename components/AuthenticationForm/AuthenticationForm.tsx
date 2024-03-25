'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
  import classes from './AuthenticationTitle.module.css';
  
  export function AuthenticationTitle() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component="button"
          onClick={() => router.push('/signup')}
          >
            Create account
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required 
          onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" 
          onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl"
          onClick={async () => {
            await signIn('credentials', {
              email,
              password,
              callbackUrl: '/dashboard',
            });
          
          }}
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }