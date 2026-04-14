import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  static const String _tokenKey = 'access_token';
  static const String _themeKey = 'theme_mode';
  static const String _resolvedUserIdKey = 'resolved_user_id';
  static const String _loginEmailKey = 'login_email';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<void> saveLoginEmail(String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_loginEmailKey, email);
  }

  static Future<String?> getLoginEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_loginEmailKey);
  }

  static Future<void> saveResolvedUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_resolvedUserIdKey, userId);
  }

  static Future<String?> getResolvedUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_resolvedUserIdKey);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_resolvedUserIdKey);
    await prefs.remove(_loginEmailKey);
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  static Future<String?> currentUserId() async {
    final resolved = await getResolvedUserId();
    if (_looksLikeMongoId(resolved)) {
      return resolved;
    }

    final token = await getToken();
    if (token == null || token.isEmpty) return null;
    try {
      final parts = token.split('.');
      if (parts.length < 2) return null;
      final normalized = base64Url.normalize(parts[1]);
      final payload = jsonDecode(utf8.decode(base64Url.decode(normalized)))
          as Map<String, dynamic>;
      final userId = payload['userId']?.toString();
      return _looksLikeMongoId(userId) ? userId : null;
    } catch (_) {
      return null;
    }
  }

  static Future<Map<String, String?>> tokenIdentity() async {
    final token = await getToken();
    if (token == null || token.isEmpty) {
      return const {
        'userId': null,
        'firstName': null,
        'lastName': null,
      };
    }
    try {
      final parts = token.split('.');
      if (parts.length < 2) {
        return const {'userId': null, 'firstName': null, 'lastName': null};
      }
      final normalized = base64Url.normalize(parts[1]);
      final payload = jsonDecode(utf8.decode(base64Url.decode(normalized)))
          as Map<String, dynamic>;
      return {
        'userId': payload['userId']?.toString(),
        'firstName': payload['firstName']?.toString(),
        'lastName': payload['lastName']?.toString(),
      };
    } catch (_) {
      return const {'userId': null, 'firstName': null, 'lastName': null};
    }
  }

  static bool _looksLikeMongoId(String? value) {
    if (value == null || value.length != 24) return false;
    final regex = RegExp(r'^[a-fA-F0-9]{24}$');
    return regex.hasMatch(value);
  }

  static Future<void> saveThemeMode(ThemeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeKey, mode.name);
  }

  static Future<ThemeMode> loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final value = prefs.getString(_themeKey);
    return ThemeMode.values.firstWhere(
      (mode) => mode.name == value,
      orElse: () => ThemeMode.system,
    );
  }
}
