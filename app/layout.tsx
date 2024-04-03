

import { inter } from '@/styles/fonts';
import { theme } from '@/styles/theme';
import '@mantine/core/styles.css';
import { ColorSchemeScript, DirectionProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import SessionProvider from '@/context/SessionProvider';
import {Navbar} from "@/components/Navbar/Navbar";

export default function RootLayout({children}
    : {children: React.ReactNode})    
{
    return (
        <html lang = "en-US">
            <body className={inter.className}>

                <ColorSchemeScript />
                <DirectionProvider>
                    <SessionProvider>
                        <MantineProvider theme={theme}>
                            <ModalsProvider>
                                {children}
                            </ModalsProvider>
                        </MantineProvider>
                    </SessionProvider>
                </DirectionProvider>
                
            </body>
        </html>
    )
}