import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

/* ======================================================
   SCHOOLGO DESIGN SYSTEM
====================================================== */

export const colors = {
  // Brand
  primary: '#246BFD',
  primaryDark: '#172B4D',
  primaryLight: '#EAF2FF',

  // Status
  success: '#19A974',
  successLight: '#E7F8F1',

  warning: '#F5B942',
  warningLight: '#FFF5D9',

  danger: '#E5484D',
  dangerLight: '#FDECEC',

  // Neutral
  background: '#F6F8FC',
  surface: '#FFFFFF',

  text: '#172B4D',
  textSecondary: '#667085',
  textMuted: '#98A2B3',

  border: '#E4E9F2',

  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

/* ======================================================
   CARD
====================================================== */

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Card({
  children,
  style,
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

/* ======================================================
   BUTTON
====================================================== */

type ButtonProps = {
  title: string;
  onPress: () => void;

  disabled?: boolean;

  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'ghost';
};

export function Button({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,

        variant === 'primary' &&
          styles.buttonPrimary,

        variant === 'secondary' &&
          styles.buttonSecondary,

        variant === 'danger' &&
          styles.buttonDanger,

        variant === 'success' &&
          styles.buttonSuccess,

        variant === 'ghost' &&
          styles.buttonGhost,

        pressed &&
          !disabled &&
          styles.buttonPressed,

        disabled &&
          styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,

          variant === 'secondary' &&
            styles.buttonSecondaryText,

          variant === 'ghost' &&
            styles.buttonGhostText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* ======================================================
   STATUS BADGE
====================================================== */

type StatusBadgeProps = {
  label: string;

  type?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral';
};

export function StatusBadge({
  label,
  type = 'info',
}: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,

        type === 'info' &&
          styles.badgeInfo,

        type === 'success' &&
          styles.badgeSuccess,

        type === 'warning' &&
          styles.badgeWarning,

        type === 'danger' &&
          styles.badgeDanger,

        type === 'neutral' &&
          styles.badgeNeutral,
      ]}
    >
      <View
        style={[
          styles.badgeDot,

          type === 'info' && {
            backgroundColor: colors.primary,
          },

          type === 'success' && {
            backgroundColor: colors.success,
          },

          type === 'warning' && {
            backgroundColor: colors.warning,
          },

          type === 'danger' && {
            backgroundColor: colors.danger,
          },

          type === 'neutral' && {
            backgroundColor: colors.textMuted,
          },
        ]}
      />

      <Text
        style={[
          styles.badgeText,

          type === 'info' && {
            color: colors.primary,
          },

          type === 'success' && {
            color: colors.success,
          },

          type === 'warning' && {
            color: '#A66B00',
          },

          type === 'danger' && {
            color: colors.danger,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* ======================================================
   INFO
====================================================== */

type InfoProps = {
  label: string;
  value: string;
};

export function Info({
  label,
  value,
}: InfoProps) {
  return (
    <View style={styles.info}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

/* ======================================================
   SECTION HEADER
====================================================== */

type SectionHeaderProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  action,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {action && (
        <Pressable
          onPress={onActionPress}
        >
          <Text style={styles.sectionAction}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  pageContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,

    fontWeight: '800',

    color: colors.text,

    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,

    color: colors.textSecondary,

    marginTop: spacing.xs,
  },

  /* CARD */

  card: {
    backgroundColor:
      colors.surface,

    borderRadius:
      radius.xl,

    padding:
      spacing.lg,

    marginBottom:
      spacing.md,

    borderWidth: 1,

    borderColor:
      colors.border,

    shadowColor:
      '#101828',

    shadowOpacity:
      0.04,

    shadowRadius:
      10,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  /* BUTTON */

  button: {
    minHeight: 50,

    paddingVertical:
      14,

    paddingHorizontal:
      spacing.lg,

    borderRadius:
      radius.md,

    alignItems:
      'center',

    justifyContent:
      'center',

    marginTop:
      spacing.md,
  },

  buttonPrimary: {
    backgroundColor:
      colors.primary,
  },

  buttonSecondary: {
    backgroundColor:
      colors.primaryLight,
  },

  buttonDanger: {
    backgroundColor:
      colors.danger,
  },

  buttonSuccess: {
    backgroundColor:
      colors.success,
  },

  buttonGhost: {
    backgroundColor:
      'transparent',

    borderWidth: 1,

    borderColor:
      colors.border,
  },

  buttonPressed: {
    opacity: 0.85,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  disabled: {
    opacity: 0.45,
  },

  buttonText: {
    color:
      colors.white,

    fontSize:
      15,

    fontWeight:
      '700',
  },

  buttonSecondaryText: {
    color:
      colors.primary,
  },

  buttonGhostText: {
    color:
      colors.text,
  },

  /* BADGE */

  badge: {
    alignSelf:
      'flex-start',

    flexDirection:
      'row',

    alignItems:
      'center',

    paddingHorizontal:
      10,

    paddingVertical:
      6,

    borderRadius:
      radius.round,
  },

  badgeInfo: {
    backgroundColor:
      colors.primaryLight,
  },

  badgeSuccess: {
    backgroundColor:
      colors.successLight,
  },

  badgeWarning: {
    backgroundColor:
      colors.warningLight,
  },

  badgeDanger: {
    backgroundColor:
      colors.dangerLight,
  },

  badgeNeutral: {
    backgroundColor:
      '#F2F4F7',
  },

  badgeDot: {
    width: 7,
    height: 7,

    borderRadius:
      radius.round,

    marginRight:
      spacing.sm,
  },

  badgeText: {
    fontSize: 12,

    fontWeight: '700',

    color:
      colors.textSecondary,
  },

  /* INFO */

  info: {
    marginTop:
      spacing.md,
  },

  label: {
    fontSize: 12,

    color:
      colors.textSecondary,

    marginBottom:
      3,
  },

  value: {
    fontSize: 17,

    color:
      colors.text,

    fontWeight:
      '700',
  },

  /* SECTION */

  sectionHeader: {
    flexDirection:
      'row',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    marginTop:
      spacing.xl,

    marginBottom:
      spacing.md,
  },

  sectionTitle: {
    fontSize: 18,

    fontWeight: '800',

    color:
      colors.text,
  },

  sectionAction: {
    fontSize: 14,

    color:
      colors.primary,

    fontWeight:
      '700',
  },
});

export const ui = styles;