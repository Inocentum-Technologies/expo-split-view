import { createContext } from 'react';
import type { SplitViewLeftHeaderValueProps } from './types';

// Default is used outside the left pane (for example the index.tsx list on phones).
export const SplitViewLeftHeaderContext = createContext<SplitViewLeftHeaderValueProps>({
    canGoBack: false,
    goBack: () => { },
});