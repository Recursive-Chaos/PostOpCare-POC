import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { palette, styles } from "../../App.styles";

type Props = {
  title: string;
  subtitle: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType: "email-address" | "number-pad";
  maxLength?: number;
  error?: string;
  loading: boolean;
  buttonText: string;
  onSubmit: () => void;
  onBack?: () => void;
  backText?: string;
};

export function AuthForm({
  title,
  subtitle,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  error,
  loading,
  buttonText,
  onSubmit,
  onBack,
  backText,
}: Props) {
  return (
    <View style={styles.authContainer} testID="login-container">
      <Text style={styles.authTitle}>{title}</Text>
      <Text style={styles.authSubtitle}>{subtitle}</Text>

      <View style={styles.authInputContainer}>
        <Text style={styles.authLabel}>{label}</Text>
        <TextInput
          testID="auth-input"
          style={styles.authInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textTertiary}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={maxLength}
        />
      </View>

      {error ? (
        <Text style={styles.authError} testID="error-message">
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        testID="auth-button"
        style={[styles.authButton, loading && styles.authButtonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" testID="loading-indicator" />
        ) : (
          <Text style={styles.authButtonText}>{buttonText}</Text>
        )}
      </TouchableOpacity>

      {onBack && backText && (
        <TouchableOpacity
          testID="back-button"
          style={styles.authBackButton}
          onPress={onBack}
          disabled={loading}
        >
          <Text style={styles.authBackButtonText}>{backText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
