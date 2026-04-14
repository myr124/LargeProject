import 'package:flutter/material.dart';

import '../models/app_user.dart';
import '../services/api_service.dart';
import '../widgets/app_avatar.dart';
import 'profile_screen.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final _searchController = TextEditingController();
  bool _loading = true;
  String? _currentUserId;
  List<AppUser> _users = const [];
  Set<String> _following = <String>{};
  Set<String> _pending = <String>{};

  @override
  void initState() {
    super.initState();
    _load();
    _searchController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final currentUserId = await ApiService.resolveCurrentUserId();
    final users = await ApiService.getAllUsers();
    final following =
        currentUserId == null ? const <String>[] : await ApiService.getFollowing(currentUserId);
    if (!mounted) return;
    setState(() {
      _currentUserId = currentUserId;
      _users = users;
      _following = following.toSet();
      _loading = false;
    });
  }

  List<AppUser> get _filtered {
    final query = _searchController.text.trim().toLowerCase();
    return _users.where((user) {
      if (user.id == _currentUserId) return false;
      if (query.isEmpty) return true;
      return user.fullName.toLowerCase().contains(query) ||
          user.username.toLowerCase().contains(query);
    }).toList();
  }

  Future<void> _toggleFollow(AppUser user) async {
    if (_currentUserId == null || _pending.contains(user.id)) return;
    final shouldFollow = !_following.contains(user.id);
    setState(() {
      _pending = {..._pending, user.id};
      if (shouldFollow) {
        _following = {..._following, user.id};
      } else {
        _following = {..._following}..remove(user.id);
      }
    });

    final result = await ApiService.follow(
      followerId: _currentUserId!,
      followingId: user.id,
      shouldFollow: shouldFollow,
    );

    if (!mounted) return;
    setState(() {
      _pending = {..._pending}..remove(user.id);
      if (result['error'] != null) {
        if (shouldFollow) {
          _following = {..._following}..remove(user.id);
        } else {
          _following = {..._following, user.id};
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Community')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.search_rounded),
                    hintText: 'Search by name or username',
                  ),
                ),
                const SizedBox(height: 18),
                ..._filtered.map(
                  (user) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        child: Row(
                          children: [
                            Expanded(
                              child: InkWell(
                                borderRadius: BorderRadius.circular(16),
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => ProfileScreen(viewedUserId: user.id),
                                    ),
                                  );
                                },
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  child: Row(
                                    children: [
                                      AppAvatar(user: user),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              user.fullName,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(fontWeight: FontWeight.w800),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              '@${user.username} • ${user.followerCount} followers',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            if (_currentUserId != null) ...[
                              const SizedBox(width: 12),
                              SizedBox(
                                width: 108,
                                height: 44,
                                child: ElevatedButton(
                                  onPressed: _pending.contains(user.id)
                                      ? null
                                      : () => _toggleFollow(user),
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: Size.zero,
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  ),
                                  child: Text(
                                    _following.contains(user.id) ? 'Unfollow' : 'Follow',
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
