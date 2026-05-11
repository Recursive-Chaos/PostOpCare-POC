import { StyleSheet, Platform, Dimensions } from 'react-native';

// Dimensiunile ecranului se incarca o singura data cand se deschide poza
// Daca se roteste telefonul nu se roteste poza
const SCREEN = Dimensions.get('window');

export const palette = {
  primary: '#1B6B3A',
  background: '#F7F9F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F4F2',
  textPrimary: '#0F1A14',
  textSecondary: '#4F5B55',
  textTertiary: '#8A948E',
  border: '#E2E8E4',
  warning: '#E59A3D',
  danger: '#D14D4D',
  low: '#3FA864',
};

const FONT = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: 'sans-serif',
  default: 'System'
});

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  greetingHello: {
    fontFamily: FONT,
    fontSize: 16,
    color: palette.textSecondary,
  },
  greetingName: {
    fontFamily: FONT,
    fontSize: 32,
    fontWeight: '700',
    color: palette.textPrimary,
    marginTop: 2,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: palette.surfaceMuted,
    borderRadius: 8,
  },
  logoutText: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.danger,
    fontWeight: '600',
  },

  recoveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  recoveryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.low,
    marginRight: 8,
  },
  recoveryText: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textSecondary,
  },
  recoveryDayNumber: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  recoverySeparator: {
    width: 1,
    height: 14,
    backgroundColor: palette.border,
    marginHorizontal: 12,
  },
  recoverySurgery: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textSecondary,
  },

  questionnaireCard: {
    backgroundColor: palette.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  questionnaireHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionnaireLabel: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  questionnaireBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  questionnaireBadgeText: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  questionnaireTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionnaireTitle: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  questionnaireChevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionnaireChevronText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONT,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
    letterSpacing: 1.2,
  },
  sectionMeta: {
    fontFamily: FONT,
    fontSize: 12,
    color: palette.textTertiary,
  },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  historyDateBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  historyDay: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
    lineHeight: 22,
  },
  historyMonth: {
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: '700',
    color: palette.textTertiary,
    letterSpacing: 1,
    marginTop: 2,
  },
  historyBody: {
    flex: 1,
  },
  historyWeekdayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  historyWeekday: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
    marginRight: 6,
  },
  historyMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  historyMetricDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  historyMetricText: {
    fontFamily: FONT,
    fontSize: 13,
    color: palette.textSecondary,
  },
  historyChevron: {
    fontFamily: FONT,
    fontSize: 18,
    color: palette.textTertiary,
    marginLeft: 6,
  },
  // Auth Styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authTitle: {
    fontFamily: FONT,
    fontSize: 28,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 8,
  },
  authSubtitle: {
    fontFamily: FONT,
    fontSize: 16,
    color: palette.textSecondary,
    marginBottom: 32,
  },
  authInputContainer: {
    marginBottom: 24,
  },
  authLabel: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: 8,
  },
  authInput: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: FONT,
  },
  authError: {
    color: palette.danger,
    fontSize: 14,
    fontFamily: FONT,
    marginBottom: 16,
    marginTop: -8,
  },
  authButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT,
  },
  authBackButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  authBackButtonText: {
    color: palette.textSecondary,
    fontSize: 15,
    fontFamily: FONT,
    fontWeight: '500',
  },

  // Ecranul de istoric
  
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: palette.surfaceMuted,
    borderRadius: 10,
  },
  backButtonIcon: {
    fontFamily: FONT,
    fontSize: 18,
    color: palette.textPrimary,
    fontWeight: '700',
    marginRight: 6,
  },
  backButtonText: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  detailTitle: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '700',
    color: palette.textPrimary,
    marginLeft: 14,
    flex: 1,
  },
  detailDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  detailDateInfo: {
    flex: 1,
  },
  detailDateWeekday: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  detailSection: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  detailSectionTitle: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '700',
    color: palette.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  detailItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  detailItemLast: {
    borderBottomWidth: 0,
  },
  detailItemLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  detailItemValue: {
    fontFamily: FONT,
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  detailMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  detailMetricLabel: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textSecondary,
  },
  detailMetricValue: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  detailNote: {
    fontFamily: FONT,
    fontSize: 14,
    color: palette.textPrimary,
    lineHeight: 20,
  },

  // Galerie de poze (grid + viewer fullscreen)
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoThumbnailWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: palette.surfaceMuted,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  photoModal: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photoModalScroll: {
    flex: 1,
  },
  photoModalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFullImage: {
    width: SCREEN.width,
    height: SCREEN.height,
  },
  photoCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: FONT,
    lineHeight: 28,
  },
});
