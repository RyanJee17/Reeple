import type { ComponentProps } from 'react';
import { Button } from '../components/ui/button';

/** Reuses the installed UI button and exposes its variant to the Figma token styles. */
export function StockButton({ variant = 'default', ...props }: ComponentProps<typeof Button>) {
  return <Button variant={variant} data-variant={variant} {...props} />;
}
