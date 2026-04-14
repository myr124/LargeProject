import 'package:flutter/material.dart';

class AppTheme {
  static const Color warmBg = Color(0xFFF3EEDD);
  static const Color warmFg = Color(0xFF695A48);
  static const Color warmCard = Color(0xFFF3EEDD);
  static const Color warmPrimary = Color(0xFF9A775B);
  static const Color warmSecondary = Color(0xFFC4B08B);
  static const Color warmMuted = Color(0xFFD8C7AC);
  static const Color warmBorder = Color(0xFFC4B08B);
  static const Color warmSidebar = Color(0xFFE5DBC4);

  static const Color darkBg = Color(0xFF38322E);
  static const Color darkFg = Color(0xFFE4DEC8);
  static const Color darkCard = Color(0xFF524941);
  static const Color darkPrimary = Color(0xFFD29E63);
  static const Color darkSecondary = Color(0xFFA7694D);
  static const Color darkMuted = Color(0xFF695A48);
  static const Color darkBorder = Color(0xFF695A48);

  static ThemeData get lightTheme {
    const scheme = ColorScheme(
      brightness: Brightness.light,
      primary: warmPrimary,
      onPrimary: Colors.white,
      secondary: warmSecondary,
      onSecondary: Colors.white,
      error: Color(0xFF5C3636),
      onError: Colors.white,
      surface: warmCard,
      onSurface: warmFg,
    );
    return _buildTheme(scheme, warmBg, warmFg, warmMuted, warmBorder);
  }

  static ThemeData get darkTheme {
    const scheme = ColorScheme(
      brightness: Brightness.dark,
      primary: darkPrimary,
      onPrimary: darkBg,
      secondary: darkSecondary,
      onSecondary: darkFg,
      error: Color(0xFFE58D8D),
      onError: darkBg,
      surface: darkCard,
      onSurface: darkFg,
    );
    return _buildTheme(scheme, darkBg, darkFg, darkMuted, darkBorder);
  }

  static ThemeData _buildTheme(
    ColorScheme scheme,
    Color background,
    Color foreground,
    Color muted,
    Color border,
  ) {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: background,
      textTheme: ThemeData(
        useMaterial3: true,
        colorScheme: scheme,
      ).textTheme.apply(
        bodyColor: foreground,
        displayColor: foreground,
      ),
    );

    return base.copyWith(
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: foreground,
        centerTitle: false,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: scheme.surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(color: border),
        ),
      ),
      dividerColor: border,
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: scheme.primary, width: 1.4),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: scheme.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: scheme.error),
        ),
        hintStyle: TextStyle(color: foreground.withValues(alpha: 0.6)),
        labelStyle: TextStyle(color: foreground.withValues(alpha: 0.75)),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: scheme.surface,
        selectedItemColor: scheme.primary,
        unselectedItemColor: foreground.withValues(alpha: 0.7),
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      chipTheme: base.chipTheme.copyWith(
        backgroundColor: background,
        side: BorderSide(color: border),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
        labelStyle: TextStyle(color: foreground),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: scheme.surface,
        contentTextStyle: TextStyle(color: foreground),
        behavior: SnackBarBehavior.floating,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: scheme.primary,
          foregroundColor: scheme.onPrimary,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: foreground,
          minimumSize: const Size.fromHeight(48),
          side: BorderSide(color: border),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: scheme.primary),
      ),
      listTileTheme: ListTileThemeData(
        iconColor: scheme.primary,
        tileColor: scheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: border),
        ),
      ),
      extensions: <ThemeExtension<dynamic>>[
        BreadBoxdColors(
          background: background,
          foreground: foreground,
          muted: muted,
          border: border,
          sidebar: scheme.brightness == Brightness.light ? warmSidebar : darkBg,
        ),
      ],
    );
  }
}

@immutable
class BreadBoxdColors extends ThemeExtension<BreadBoxdColors> {
  const BreadBoxdColors({
    required this.background,
    required this.foreground,
    required this.muted,
    required this.border,
    required this.sidebar,
  });

  final Color background;
  final Color foreground;
  final Color muted;
  final Color border;
  final Color sidebar;

  @override
  BreadBoxdColors copyWith({
    Color? background,
    Color? foreground,
    Color? muted,
    Color? border,
    Color? sidebar,
  }) {
    return BreadBoxdColors(
      background: background ?? this.background,
      foreground: foreground ?? this.foreground,
      muted: muted ?? this.muted,
      border: border ?? this.border,
      sidebar: sidebar ?? this.sidebar,
    );
  }

  @override
  BreadBoxdColors lerp(ThemeExtension<BreadBoxdColors>? other, double t) {
    if (other is! BreadBoxdColors) return this;
    return BreadBoxdColors(
      background: Color.lerp(background, other.background, t) ?? background,
      foreground: Color.lerp(foreground, other.foreground, t) ?? foreground,
      muted: Color.lerp(muted, other.muted, t) ?? muted,
      border: Color.lerp(border, other.border, t) ?? border,
      sidebar: Color.lerp(sidebar, other.sidebar, t) ?? sidebar,
    );
  }
}
