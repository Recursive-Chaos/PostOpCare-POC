import React from 'react';
import { t } from '@shared/translations';
import { useAuth } from '../hooks/useAuth';
import { AuthForm } from '../components/AuthForm';

type Props = {
  auth: ReturnType<typeof useAuth>;
};

export default function LoginScreen({ auth }: Props) {
  const { authStep, email, error, actionLoading, requestCode, verifyCode, resetStep } = auth;
  const [localEmail, setLocalEmail] = React.useState(email);
  const [code, setCode] = React.useState('');

  if (authStep === 'email') {
    return (
      <AuthForm
        title={t('loginTitle')}
        subtitle={t('patientLoginSubtitle')}
        label={t('emailLabel')}
        value={localEmail}
        onChangeText={setLocalEmail}
        placeholder={t('emailPlaceholder')}
        keyboardType="email-address"
        error={error}
        loading={actionLoading}
        buttonText={t('sendCodeBtn')}
        onSubmit={() => requestCode(localEmail)}
      />
    );
  }

  return (
    <AuthForm
      title={t('enterCodeTitle')}
      subtitle={`${t('enterCodeSubtitle')} ${email}`}
      label={t('codeLabel')}
      value={code}
      onChangeText={setCode}
      placeholder={t('codePlaceholder')}
      keyboardType="number-pad"
      maxLength={8}
      error={error}
      loading={actionLoading}
      buttonText={t('verifyBtn')}
      onSubmit={() => verifyCode(code)}
      onBack={() => {
        resetStep();
        setCode('');
      }}
      backText={t('goBack')}
    />
  );
}
