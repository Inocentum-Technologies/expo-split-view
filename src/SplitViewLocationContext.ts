// SplitViewLocationContext.ts
import { createContext } from 'react';

export type SplitViewLocation = 'sidebar' | 'pane';

export const SplitViewLocationContext = createContext<SplitViewLocation>('pane');