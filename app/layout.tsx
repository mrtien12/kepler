import { inter } from '@/styles/fonts';
import { theme } from '@/styles/theme';
import '@mantine/core/styles.css';

import { ColorSchemeScript, DirectionProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
export default function RootLayout({children}
    : {children: React.ReactNode})    
{
    return (
        <html lang = "en-US">
            <body className={inter.className}>
                <ColorSchemeScript />
                <DirectionProvider>
                    <MantineProvider theme={theme}>
                        <ModalsProvider>
                            {children}
                        </ModalsProvider>
                    </MantineProvider>
                </DirectionProvider>
            </body>
        </html>
    )
}