import React from 'react';
import Header from './Header';
import TabBar from './TabBar';
import BigButton from '../ui/BigButton';

export default function Screen({
  title,
  showBack = true,
  onBack = null,
  mainAction = null,
  secondaryAction = null,
  children,
  hideTabBar = false,
  className = '',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        paddingBottom: hideTabBar
          ? mainAction
            ? '90px'
            : '24px'
          : mainAction
          ? '150px'
          : 'var(--tab-h, 72px)',
      }}
      className={`screen bg-fintech-mesh ${className}`}
    >
      <Header title={title} showBack={showBack} onBack={onBack} />

      <main
        style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        {children}
      </main>

      {/* Main Action Bar pinned above tab bar */}
      {mainAction && (
        <div
          style={{
            position: 'fixed',
            bottom: hideTabBar ? 0 : 'var(--tab-h, 64px)',
            left: 0,
            right: 0,
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 25,
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
          }}
          className="main-action-bar no-print"
        >
          <BigButton
            variant={mainAction.variant || 'primary'}
            disabled={mainAction.disabled}
            disabledReason={mainAction.disabledReason}
            onClick={mainAction.onClick}
            className="btn-shimmer"
          >
            {mainAction.label}
          </BigButton>

          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '4px',
                textAlign: 'center',
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {!hideTabBar && <TabBar />}
    </div>
  );
}
