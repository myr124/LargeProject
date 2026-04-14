import 'package:flutter/material.dart';

import '../models/app_list.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import '../widgets/post_card.dart';
import 'lists_screen.dart';

class SavedPostsScreen extends StatefulWidget {
  const SavedPostsScreen({
    super.key,
    required this.onOpenPost,
  });

  final void Function(String postId) onOpenPost;

  @override
  State<SavedPostsScreen> createState() => _SavedPostsScreenState();
}

class _SavedPostsScreenState extends State<SavedPostsScreen> {
  bool _loading = true;
  String? _currentUserId;
  List<Post> _posts = const [];
  List<AppList> _lists = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final userId = await ApiService.resolveCurrentUserId();
    if (userId == null) {
      if (!mounted) return;
      setState(() {
        _currentUserId = null;
        _loading = false;
      });
      return;
    }

    final user = await ApiService.getUserInfo(userId);
    final lists = await ApiService.getLists(userId);
    final posts = <Post>[];
    if (user != null) {
      for (final postId in user.savedPosts) {
        final post = await ApiService.getPostById(postId);
        if (post != null) posts.add(post);
      }
    }

    if (!mounted) return;
      setState(() {
        _currentUserId = userId;
        _lists = lists;
        _posts = posts;
        _loading = false;
      });
  }

  Future<void> _unsave(String postId) async {
    if (_currentUserId == null) return;
    final result = await ApiService.unsavePost(userId: _currentUserId!, postId: postId);
    if (!mounted) return;
    if (result['error'] == null) {
      setState(() => _posts = _posts.where((post) => post.id != postId).toList());
    }
  }

  Future<void> _pickList(Post post) async {
    if (_lists.isEmpty) {
      Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ListsScreen()));
      return;
    }
    final picked = await showModalBottomSheet<AppList>(
      context: context,
      builder: (context) {
        return ListView(
          shrinkWrap: true,
          children: _lists
              .map(
                (list) => ListTile(
                  title: Text(list.name),
                  onTap: () => Navigator.of(context).pop(list),
                ),
              )
              .toList(),
        );
      },
    );
    if (picked == null) return;
    await ApiService.addToList(listId: picked.id, postId: post.id);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Added "${post.title}" to ${picked.name}.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_currentUserId == null) {
      return const Center(child: Text('Log in to view your saved posts.'));
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Saved creations',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ListsScreen()),
                  );
                },
                child: const Text('Manage lists'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_posts.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text('Posts you save will appear here.'),
              ),
            )
          else
            ..._posts.map(
              (post) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Column(
                  children: [
                    PostCard(post: post, onTap: () => widget.onOpenPost(post.id)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => _pickList(post),
                            icon: const Icon(Icons.playlist_add_rounded),
                            label: const Text('Add to list'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => _unsave(post.id),
                            icon: const Icon(Icons.delete_outline_rounded),
                            label: const Text('Remove'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
