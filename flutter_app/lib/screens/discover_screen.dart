import 'package:flutter/material.dart';

import '../models/post.dart';
import '../services/api_service.dart';
import '../widgets/post_card.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({
    super.key,
    required this.onOpenPost,
  });

  final void Function(String postId) onOpenPost;

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  final _searchController = TextEditingController();
  bool _loading = true;
  List<Post> _posts = const [];

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
    final posts = await ApiService.getAllPosts();
    if (!mounted) return;
    setState(() {
      _posts = posts;
      _loading = false;
    });
  }

  List<Post> get _filtered {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return _posts;
    return _posts.where((post) {
      return post.title.toLowerCase().contains(query) ||
          post.description.toLowerCase().contains(query) ||
          post.tags.any((tag) => tag.toLowerCase().contains(query)) ||
          post.ingredients.any((ingredient) => ingredient.toLowerCase().contains(query));
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: _searchController,
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search_rounded),
              hintText: 'Search by title, ingredient, or tag',
            ),
          ),
          const SizedBox(height: 18),
          Text(
            '${_filtered.length} recipe${_filtered.length == 1 ? '' : 's'}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 12),
          if (_filtered.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text('No recipes match this search.'),
              ),
            )
          else
            Wrap(
              spacing: 16,
              runSpacing: 16,
              children: _filtered
                  .map(
                    (post) => SizedBox(
                      width: 280,
                      child: PostCard(
                        post: post,
                        onTap: () => widget.onOpenPost(post.id),
                        subtitle: post.tags.isEmpty
                            ? null
                            : Text(
                                post.tags.first,
                                overflow: TextOverflow.ellipsis,
                              ),
                      ),
                    ),
                  )
                  .toList(),
            ),
        ],
      ),
    );
  }
}
