import 'package:flutter/material.dart';

import '../screens/community_screen.dart';
import '../screens/discover_screen.dart';
import '../screens/home_screen.dart';
import '../screens/lists_screen.dart';
import '../screens/new_post_screen.dart';
import '../screens/post_detail_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/saved_posts_screen.dart';
import '../services/session_service.dart';

class AppShell extends StatefulWidget {
  const AppShell({
    super.key,
    required this.onLogout,
    required this.themeMode,
    required this.onToggleTheme,
  });

  final Future<void> Function() onLogout;
  final ThemeMode themeMode;
  final Future<void> Function() onToggleTheme;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;
  int _refreshToken = 0;
  String? _currentUserId;

  @override
  void initState() {
    super.initState();
    _loadCurrentUserId();
  }

  Future<void> _loadCurrentUserId() async {
    final userId = await SessionService.currentUserId();
    if (!mounted) return;
    setState(() => _currentUserId = userId);
  }

  void _openPost(String postId) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => PostDetailScreen(postId: postId)),
    );
  }

  Future<void> _openProfile([String? userId]) async {
    await Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => ProfileScreen(viewedUserId: userId)),
    );
    setState(() => _refreshToken++);
  }

  Widget _buildBody() {
    switch (_index) {
      case 0:
        return HomeScreen(
          key: ValueKey('home-$_refreshToken'),
          onOpenPost: _openPost,
          onOpenProfile: _openProfile,
        );
      case 1:
        return DiscoverScreen(
          key: ValueKey('discover-$_refreshToken'),
          onOpenPost: _openPost,
        );
      case 2:
        return NewPostScreen(
          onCreated: (postId) {
            setState(() {
              _index = 0;
              _refreshToken++;
            });
            _openPost(postId);
          },
        );
      case 3:
        return SavedPostsScreen(
          key: ValueKey('saved-$_refreshToken'),
          onOpenPost: _openPost,
        );
      case 4:
      default:
        return ProfileScreen(
          key: ValueKey('profile-${_currentUserId ?? 'anon'}-$_refreshToken'),
          viewedUserId: _currentUserId,
          embedded: true,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    const titles = ['BreadBoxd', 'Discover', 'New Post', 'Saved', 'Profile'];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_index]),
        actions: [
          IconButton(
            tooltip: widget.themeMode == ThemeMode.dark ? 'Use light theme' : 'Use dark theme',
            onPressed: widget.onToggleTheme,
            icon: Icon(widget.themeMode == ThemeMode.dark
                ? Icons.light_mode_rounded
                : Icons.dark_mode_rounded),
          ),
          PopupMenuButton<String>(
            onSelected: (value) async {
              if (value == 'community') {
                await Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const CommunityScreen()),
                );
                setState(() => _refreshToken++);
                return;
              }
              if (value == 'lists') {
                await Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const ListsScreen()),
                );
                setState(() => _refreshToken++);
                return;
              }
              if (value == 'logout') {
                await widget.onLogout();
              }
            },
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'community', child: Text('Community')),
              PopupMenuItem(value: 'lists', child: Text('Lists')),
              PopupMenuItem(value: 'logout', child: Text('Log out')),
            ],
          ),
        ],
      ),
      body: _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (value) => setState(() => _index = value),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.search_rounded), label: 'Discover'),
          BottomNavigationBarItem(icon: Icon(Icons.add_box_rounded), label: 'Post'),
          BottomNavigationBarItem(icon: Icon(Icons.bookmark_rounded), label: 'Saved'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}
