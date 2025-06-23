import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { BrowserRouter } from 'react-router';
import { UserProvider } from './contexts/UsersContext.tsx';
import { QuestionsProvider } from './contexts/QuestionsContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
    <BrowserRouter>
        <UserProvider>
            <QuestionsProvider>
                <App />
            </QuestionsProvider>
        </UserProvider>
    </BrowserRouter>
)
