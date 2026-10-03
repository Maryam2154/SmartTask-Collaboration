import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'SmartTask — Collaboration Workspace',description:'Professional project and team collaboration dashboard'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
