import 'package:flutter/material.dart';

import '../models/app_user.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import '../widgets/app_avatar.dart';
import '../widgets/post_card.dart';
import 'post_detail_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    super.key,
    required this.viewedUserId,
    this.embedded = false,
  });

  final String? viewedUserId;
  final bool embedded;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loading = true;
  String? _currentUserId;
  AppUser? _user;
  List<Post> _posts = const [];
  bool _isFollowing = false;
  bool _followPending = false;

  bool get _isOwnProfile => _currentUserId != null && _currentUserId == widget.viewedUserId;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final currentUserId = await ApiService.resolveCurrentUserId();
    final viewedId = widget.viewedUserId ?? currentUserId;
    if (viewedId == null) {
      if (!mounted) return;
      setState(() {
        _currentUserId = currentUserId;
        _loading = false;
      });
      return;
    }

    final user = await ApiService.getUserInfo(viewedId);
    final posts = await ApiService.getPostsByUser(viewedId);
    bool isFollowing = false;
    if (currentUserId != null && currentUserId != viewedId) {
      final following = await ApiService.getFollowing(currentUserId);
      isFollowing = following.contains(viewedId);
    }

    if (!mounted) return;
    setState(() {
      _currentUserId = currentUserId;
      _user = user;
      _posts = posts;
      _isFollowing = isFollowing;
      _loading = false;
    });
  }

  Future<void> _toggleFollow() async {
    if (_currentUserId == null || widget.viewedUserId == null || _followPending) return;
    final shouldFollow = !_isFollowing;
    setState(() => _followPending = true);
    final result = await ApiService.follow(
      followerId: _currentUserId!,
      followingId: widget.viewedUserId!,
      shouldFollow: shouldFollow,
    );
    if (!mounted) return;
    if (result['error'] == null) {
      setState(() {
        _isFollowing = shouldFollow;
        if (_user != null) {
          _user = _user!.copyWith(
            followerCount: _user!.followerCount + (shouldFollow ? 1 : -1),
          );
        }
      });
    }
    setState(() => _followPending = false);
  }

  Future<void> _deletePost(Post post) async {
    if (_currentUserId == null) return;
    final result = await ApiService.deletePost(userId: _currentUserId!, postId: post.id);
    if (!mounted) return;
    if (result['error'] == null) {
      setState(() => _posts = _posts.where((item) => item.id != post.id).toList());
    }
  }

  Future<void> _editProfile() async {
    if (_user == null) return;
    final firstName = TextEditingController(text: _user!.firstName);
    final lastName = TextEditingController(text: _user!.lastName);
    final username = TextEditingController(text: _user!.username);
    final imageUrl = TextEditingController(text: _user!.profilePictureUrl ?? '');

    final shouldSave = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Edit profile'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: firstName, decoration: const InputDecoration(labelText: 'First name')),
                const SizedBox(height: 12),
                TextField(controller: lastName, decoration: const InputDecoration(labelText: 'Last name')),
                const SizedBox(height: 12),
                TextField(controller: username, decoration: const InputDecoration(labelText: 'Username')),
                const SizedBox(height: 12),
                TextField(controller: imageUrl, decoration: const InputDecoration(labelText: 'Profile picture URL')),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
            ElevatedButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('Save')),
          ],
        );
      },
    );

    if (shouldSave != true || _currentUserId == null) return;
    await ApiService.updateUser(
      userId: _currentUserId!,
      firstName: firstName.text.trim(),
      lastName: lastName.text.trim(),
      username: username.text.trim(),
      profilePictureUrl: imageUrl.text.trim(),
    );
    if (!mounted) return;
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return widget.embedded
          ? const Center(child: CircularProgressIndicator())
          : const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (_user == null) {
      return widget.embedded
          ? const Center(child: Text('User not found.'))
          : const Scaffold(body: Center(child: Text('User not found.')));
    }

    final content = RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppAvatar(user: _user!, radius: 42),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _user!.fullName,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text('@${_user!.username}'),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 18,
                      runSpacing: 8,
                      children: [
                        Text('${_user!.postCount} posts'),
                        Text('${_user!.followerCount} followers'),
                        Text('${_user!.followingCount} following'),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          if (_isOwnProfile)
            OutlinedButton(
              onPressed: _editProfile,
              child: const Text('Edit profile'),
            )
          else if (_currentUserId != null)
            ElevatedButton(
              onPressed: _followPending ? null : _toggleFollow,
              child: Text(_isFollowing ? 'Unfollow' : 'Follow'),
            ),
          const SizedBox(height: 20),
          Text(
            'Creations',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 12),
          if (_posts.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text('Nothing to see here yet.'),
              ),
            )
          else
            ..._posts.map(
              (post) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Column(
                  children: [
                    PostCard(
                      post: post,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => PostDetailScreen(postId: post.id),
                          ),
                        );
                      },
                    ),
                    if (_isOwnProfile) ...[
                      const SizedBox(height: 8),
                      OutlinedButton.icon(
                        onPressed: () => _deletePost(post),
                        icon: const Icon(Icons.delete_outline_rounded),
                        label: const Text('Delete post'),
                      ),
                    ],
                  ],
                ),
              ),
            ),
        ],
      ),
    );

    if (widget.embedded) {
      return content;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: content,
    );
  }
}
