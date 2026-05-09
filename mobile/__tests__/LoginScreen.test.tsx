import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { t } from '@shared/translations';

describe('LoginScreen', () => {
  const mockAuth = {
    authStep: 'email' as const,
    email: '',
    error: '',
    actionLoading: false,
    requestCode: jest.fn(),
    verifyCode: jest.fn(),
    resetStep: jest.fn(),
    setError: jest.fn(),
    logout: jest.fn(),
    user: null,
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and shows email step initially', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen auth={mockAuth} />);
    
    expect(getByText(t('loginTitle'))).toBeTruthy();
    expect(getByPlaceholderText(t('emailPlaceholder'))).toBeTruthy();
  });

  it('calls requestCode when email is provided', async () => {
    const { getByTestId } = render(<LoginScreen auth={mockAuth} />);
    
    const input = getByTestId('auth-input');
    fireEvent.changeText(input, 'test@test.com');
    
    const button = getByTestId('auth-button');
    fireEvent.press(button);
    
    expect(mockAuth.requestCode).toHaveBeenCalledWith('test@test.com');
  });

  it('renders code step correctly', () => {
    const codeAuth = { ...mockAuth, authStep: 'code' as const, email: 'test@test.com' };
    const { getByText } = render(<LoginScreen auth={codeAuth} />);
    
    expect(getByText(t('enterCodeTitle'))).toBeTruthy();
  });

  it('calls verifyCode when code is provided', async () => {
    const codeAuth = { ...mockAuth, authStep: 'code' as const, email: 'test@test.com' };
    const { getByTestId } = render(<LoginScreen auth={codeAuth} />);
    
    const input = getByTestId('auth-input');
    fireEvent.changeText(input, '12345678');
    
    const button = getByTestId('auth-button');
    fireEvent.press(button);
    
    expect(mockAuth.verifyCode).toHaveBeenCalledWith('12345678');
  });
});
