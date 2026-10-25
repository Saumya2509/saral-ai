import React from 'react';
import { useT } from '../../i18n/index.js';

/**
 * StepHeader component
 * Renders "Step 1 of 3 · Fill in"
 */
export default function StepHeader({ current = 1, total = 3, name = '', className = '', style = {} }) {
  const t = useT();

  const stepText = t('core.label.step', {
    current,
    total,
    name,
  }) || `Step ${current} of ${total} · ${name}`;

  return (
    <div
      style={{
        fontSize: 'var(--font-size-small, 0.875rem)',
        fontWeight: 600,
        color: 'var(--brand)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px',
        ...style,
      }}
      className={className}
    >
      {stepText}
    </div>
  );
}
