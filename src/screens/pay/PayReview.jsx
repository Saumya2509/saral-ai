import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import StepHeader from '../../components/ui/StepHeader';
import ReviewList from '../../components/ui/ReviewList';
import ChoicePrompt from '../../components/ui/ChoicePrompt';
import Notice from '../../components/ui/Notice';
import Amount from '../../components/ui/Amount';
import ReadAloud from '../../components/ui/ReadAloud';
import { formatINR, amountToSpeech } from '../../utils/money.js';
import { getTodaysUpiSpending } from '../../utils/ledger.js';
import { speak } from '../../utils/speech.js';
import config from '../../data/config.js';
import { getCustomer } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function PayReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const payee = location.state?.payee || { name: 'Recipient', bank: 'Bank', accountNumber: '••••' };
  const amountPaise = location.state?.amountPaise || 0;
  const note = location.state?.note || '';

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);

  const [safetyCheckPassed, setSafetyCheckPassed] = useState(
    amountPaise <= config.limits.safetyCheckAbovePaise
  );
  const [simpleConfirmPassed, setSimpleConfirmPassed] = useState(
    state.settings.mode !== 'simple' || amountPaise <= config.limits.simpleConfirmAbovePaise
  );

  const isNewPayee = payee.isNew || false;
  const upiDailyLimit = state.records?.upiLimits?.dailyPaise || 10000000;
  const todaySpent = getTodaysUpiSpending(customerId);
  const exceedsDailyLimit = (todaySpent + amountPaise) > upiDailyLimit;

  const spokenAmount = amountToSpeech(amountPaise, lang);
  const reviewSpeechText =
    lang === 'hi'
      ? `भुगतान समीक्षा। आप ${payee.name} को ${spokenAmount} भेज रहे हैं। आपके खाते के अंतिम चार अंक ${customer.accountNumber.slice(-4)} हैं।`
      : `Payment review. You are sending ${spokenAmount} to ${payee.name} from account ending in ${customer.accountNumber.slice(-4)}.`;

  // Auto-announce on mount for accessibility / blind users if enabled
  useEffect(() => {
    if (state.settings.readAloud || state.settings.mode === 'simple') {
      speak(reviewSpeechText, lang);
    }
  }, [state.settings.readAloud, state.settings.mode, reviewSpeechText, lang]);

  const handleProceedToPin = () => {
    navigate('/pay/pin', {
      state: {
        payee,
        amountPaise,
        note,
      },
    });
  };

  const handleSomeoneAskedMe = () => {
    navigate('/pay/stopped', {
      state: {
        reason: 'someone-asked',
        amountPaise,
        payee,
      },
    });
  };

  const reviewItems = [
    { label: t('pay.review.to') || 'To', value: payee.name },
    { label: 'Recipient bank', value: payee.bank },
    {
      label: t('pay.review.amount') || 'Amount',
      value: <Amount paise={amountPaise} size="large" />,
    },
    {
      label: t('pay.review.from') || 'From account',
      value: `${customer.accountNumber} (${customer.name[lang] || customer.name.en})`,
    },
    ...(note ? [{ label: 'Note', value: note }] : []),
  ];

  return (
    <Screen
      title={t('core.tab.pay') || 'Send money'}
      mainAction={
        safetyCheckPassed && simpleConfirmPassed && !exceedsDailyLimit
          ? {
              label: t('core.btn.confirm') || 'Confirm with PIN',
              onClick: handleProceedToPin,
            }
          : null
      }
      secondaryAction={{
        label: t('core.btn.change') || 'Change details',
        onClick: () => navigate(-1),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StepHeader current={2} total={3} name={t('core.step.review') || 'Review'} />
        <ReadAloud text={reviewSpeechText} label="Listen" />
      </div>

      {/* Daily limit block notice */}
      {exceedsDailyLimit && (
        <Notice type="error" title="Daily UPI Limit Exceeded">
          This payment of {formatINR(amountPaise)} plus today's spending of {formatINR(todaySpent)} exceeds your daily limit of {formatINR(upiDailyLimit)}. Remaining today: {formatINR(Math.max(0, upiDailyLimit - todaySpent))}. Lower the amount or change your limit in Services.
        </Notice>
      )}

      {/* New payee 24h safety limit warning */}
      {isNewPayee && (
        <Notice type="safety" title="New Payee Rule">
          {config.newPayeeRule[lang] || config.newPayeeRule.en}
        </Notice>
      )}

      {/* Review details */}
      <ReviewList items={reviewItems} />

      {/* Large Payment Safety Check Prompt */}
      {!safetyCheckPassed && (
        <ChoicePrompt
          title={t('pay.safetyCheck.title') || 'Safety Check'}
          message={
            t('pay.safetyCheck.question') ||
            'Did someone call, message, or ask you to send this money?'
          }
          primaryLabel={t('core.safety.decidedMyself') || 'No, I decided this myself'}
          secondaryLabel={t('core.safety.someoneAsked') || 'Yes, someone asked me'}
          onPrimary={() => setSafetyCheckPassed(true)}
          onSecondary={handleSomeoneAskedMe}
        />
      )}

      {/* Simple mode extra confirmation for > ₹5,000 */}
      {safetyCheckPassed && !simpleConfirmPassed && (
        <ChoicePrompt
          title={t('pay.simpleConfirm.title') || 'Confirm Large Payment'}
          message={`This is a payment of ${formatINR(amountPaise)}. Are you sure you want to proceed?`}
          primaryLabel="Yes, I am sure"
          secondaryLabel="No, go back"
          onPrimary={() => setSimpleConfirmPassed(true)}
          onSecondary={() => navigate(-1)}
        />
      )}
    </Screen>
  );
}
