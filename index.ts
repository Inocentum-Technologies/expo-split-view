import { SplitView as BaseSplitView } from './src/SplitView';
import { SplitViewDetail } from './src/SplitViewDetail';
import { SplitViewPlaceholder } from './src/SplitViewPlaceholder';

export * from './src/types';
export * from './src/SplitView';
export * from './src/SplitViewPlaceholder';
export * from './src/SplitViewDetail';
export * from './src/useSplitView';
export * from './src/useDetailScreenBack';

/**
 * Compound component for SplitView layout.
 *
 * Usage:
 * - `<SplitView master={<MasterList />} />` in your `_layout.tsx`
 * - `<SplitView.Placeholder master={<MasterList />} />` in your `index.tsx`
 * - `<SplitView.Detail>...</SplitView.Detail>` in your `[id]/index.tsx`
 */
export const SplitView = Object.assign(BaseSplitView, {
    Placeholder: SplitViewPlaceholder,
    Detail: SplitViewDetail,
});
