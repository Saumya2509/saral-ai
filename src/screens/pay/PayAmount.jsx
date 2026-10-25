import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import StepHeader from '../../components/ui/StepHeader';
import Card from '../../components/ui/Card';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import ChoicePrompt from '../../components/ui/ChoicePrompt';
import { rupeesToPaise, formatINR } from '../../utils/money.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { getCustomer } from '../../data/customers.js';

export default function PayAmount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const payee = location.state?.payee || { name: 'Recipient', bank: 'Bank', accountNumber: '••••' };
  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);

  const initialAmount = location.state?.amountPaise || location.state?.payee?.amountPaise || 0;
  const [rupeesInput, setRupeesInput] = useState(
    initialAmount > 0 ? String(initialAmount / 100) : ''
  );
  const [note, setNote] = useState(location.state?.note || '');
  const [showOverLimitPrompt, setShowOverLimitPrompt] = useState(false);
  const [limitErrorMessage, setLimitErrorMessage] = useState('');

  const amountPaise = rupeesToPaise(rupeesInput);
  const isYoung = state.settings.mode === 'young' || customer.isMinor;
  const youngDailyLimit = state.young?.dailyLimitPaise || 100000; // ₹1,000 for young saver
  const upiDailyLimit = state.records?.upiLimits?.dailyPaise || 10000000; // Customer set limit e.g. ₹1,000

  const handleReview = () => {
    if (amountPaise <= 0) return;

    // Check 1: UPI Daily Limit set by user in Services
    if (amountPaise > upiDailyLimit) {
      setLimitErrorMessage(
        `This amount of ${formatINR(amountPaise)} exceeds your configured daily UPI limit of ${formatINR(
          upiDailyLimit
        )}. Please enter a lower amount or update your limit in Services.`
      );
      return;
    }

    // Check 2: Minor / Young Saver guardian limit
    if (isYoung && amountPaise > youngDailyLimit) {
      setShowOverLimitPrompt(true);
      return;
    }

    setLimitErrorMessage('');

    navigate('/pay/review', {
      state: {
        payee,
        amountPaise,
        note,
      },
    });
  };

  const handleAskGuardian = () => {
    const req = {
      id: `greq_${Date.now()}`,
      customerId,
      childId: customerId,
      counterparty: payee.name,
      amountPaise,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GUARDIAN_REQUEST', payload: req });
    alert('Request sent to guardian (Meena) for approval.');
    navigate('/');
  };

  return (
    <Screen
      title={t('core.tab.pay') || 'Send money'}
      mainAction={{
        label: t('core.btn.review') || 'Review',
        disabled: amountPaise <= 0,
        onClick: handleReview,
      }}
    >
      <StepHeader current={1} total={3} name={t('core.step.fill') || 'Fill in'} />

      {/* Recipient summary card */}
      <Card className="card-interactive">
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Paying to:</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
          {payee.name}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {payee.bank} · {payee.accountNumber}
        </div>
      </Card>

      {/* Amount input */}
      <Field
        label={t('pay.amount.label') || 'Amount in Rupees (₹)'}
        placeholder="500"
        type="number"
        value={rupeesInput}
        onChange={(e) => {
          setRupeesInput(e.target.value);
          if (limitErrorMessage) setLimitErrorMessage('');
        }}
        error={limitErrorMessage}
        hint={
          amountPaise > 0
            ? `Calculated: ${formatINR(amountPaise)} (Daily Limit: ${formatINR(upiDailyLimit)})`
            : `Your configured daily UPI limit is ${formatINR(upiDailyLimit)}`
        }
      />

      {/* Note input */}
      <Field
        label="Note (optional)"
        placeholder="For groceries, gifts, etc."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Minor Limit Warning */}
      {isYoung && (
        <Notice type="info">
          Your daily limit is ₹{(youngDailyLimit / 100).toFixed(0)}. Payments above this need approval from your guardian.
        </Notice>
      )}

      {/* Modal / prompt if over limit for young saver */}
      {showOverLimitPrompt && (
        <ChoicePrompt
          title="Payment needs guardian approval"
          message={`This payment of ${formatINR(amountPaise)} is above your daily limit of ${formatINR(
            youngDailyLimit
          )}. Would you like to request approval from Meena?`}
          primaryLabel="Ask guardian to approve"
          secondaryLabel="Change amount"
          onPrimary={handleAskGuardian}
          onSecondary={() => setShowOverLimitPrompt(false)}
        />
      )}
    </Screen>
  );
}
