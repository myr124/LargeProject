import 'package:flutter/material.dart';
import 'services/session_service.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'widgets/app_shell.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _loading = true;
  bool _isLoggedIn = false;
  ThemeMode _themeMode = ThemeMode.system;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final isLoggedIn = await SessionService.isLoggedIn();
    final themeMode = await SessionService.loadThemeMode();
    if (!mounted) return;
    setState(() {
      _isLoggedIn = isLoggedIn;
      _themeMode = themeMode;
      _loading = false;
    });
  }

  Future<void> _handleLogin() async {
    if (!mounted) return;
    setState(() => _isLoggedIn = true);
  }

  Future<void> _handleLogout() async {
    await SessionService.logout();
    if (!mounted) return;
    setState(() => _isLoggedIn = false);
  }

  Future<void> _toggleTheme() async {
    final next = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    await SessionService.saveThemeMode(next);
    if (!mounted) return;
    setState(() => _themeMode = next);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BreadBoxd',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      home: _loading
          ? const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            )
          : _isLoggedIn
              ? AppShell(
                  onLogout: _handleLogout,
                  themeMode: _themeMode,
                  onToggleTheme: _toggleTheme,
                )
              : LoginScreen(
                  onLoginSuccess: _handleLogin,
                  themeMode: _themeMode,
                  onToggleTheme: _toggleTheme,
                ),
    );
  }
}
