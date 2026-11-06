import { useContext } from 'react';
import { SplitViewLeftHeaderContext } from './SplitViewLeftHeaderContext';
import type { SplitViewLeftHeaderValueProps } from './types';

/**
 * For master list components rendered in the left pane.
 * Use together with `leftHeader={false}` on <SplitView>.
 * - canGoBack: the screen hosting the split view has a previous screen.
 * - goBack: pops the hosting screen, never right-pane screens.
 *
 * Outside the left pane (for example the phone index list) it returns
 * { canGoBack: false, goBack: noop }.
 */
export function useCustomLeftHeader(): SplitViewLeftHeaderValueProps {
    return useContext(SplitViewLeftHeaderContext);
}