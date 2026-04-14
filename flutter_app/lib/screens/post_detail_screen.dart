import 'dart:convert';

import 'package:flutter/material.dart';

import '../models/app_user.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import '../widgets/app_avatar.dart';

class PostDetailScreen extends StatefulWidget {
  const PostDetailScreen({
    super.key,
    required this.postId,
  });

  final String postId;

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  final _commentController = TextEditingController();
  bool _loading = true;
  bool _ratingPending = false;
  bool _saving = false;
  bool _commenting = false;
  String? _currentUserId;
  Post? _post;
  AppUser? _author;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final post = await ApiService.getPostById(widget.postId);
    final userId = await ApiService.resolveCurrentUserId();
    final author = post == null ? null : await ApiService.getUserInfo(post.authorId);
    if (!mounted) return;
    setState(() {
      _post = post;
      _author = author;
      _currentUserId = userId;
      _loading = false;
    });
  }

  Future<void> _rate(double rating) async {
    if (_post == null || _currentUserId == null || _ratingPending) return;
    setState(() => _ratingPending = true);
    final result = await ApiService.ratePost(
      userId: _currentUserId!,
      postId: _post!.id,
      rating: rating,
    );
    if (!mounted) return;
    setState(() {
      if (result['error'] == null) {
        _post = _post!.copyWith(rating: rating);
      }
      _ratingPending = false;
    });
  }

  Future<void> _savePost() async {
    if (_post == null || _currentUserId == null || _saving) return;
    setState(() => _saving = true);
    final result = await ApiService.savePost(userId: _currentUserId!, postId: _post!.id);
    if (!mounted) return;
    setState(() => _saving = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text((result['error'] ?? result['message'] ?? 'Saved').toString()),
      ),
    );
  }

  Future<void> _comment() async {
    if (_post == null || _currentUserId == null || _commenting) return;
    final text = _commentController.text.trim();
    if (text.isEmpty) return;
    setState(() => _commenting = true);
    final result = await ApiService.comment(
      userId: _currentUserId!,
      postId: _post!.id,
      comment: text,
    );
    if (!mounted) return;
    setState(() {
      if (result['error'] == null) {
        final comments = List<String>.from(_post!.comments)..add(text);
        _post = _post!.copyWith(comments: comments);
        _commentController.clear();
      }
      _commenting = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (_post == null) {
      return const Scaffold(body: Center(child: Text('Post not found.')));
    }

    final post = _post!;
    final imageUrl = post.imageUrls.isNotEmpty ? post.imageUrls.first : null;

    return Scaffold(
      appBar: AppBar(title: const Text('Recipe')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(28),
            child: AspectRatio(
              aspectRatio: 16 / 10,
              child: _DetailImage(imageUrl: imageUrl),
            ),
          ),
          const SizedBox(height: 22),
          Text(
            post.title,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
          const SizedBox(height: 10),
          if (_author != null)
            Row(
              children: [
                AppAvatar(user: _author!, radius: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    '${_author!.fullName} • ${post.createdAt == null ? 'Recently' : '${post.createdAt!.month}/${post.createdAt!.day}/${post.createdAt!.year}'}',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
              ],
            ),
          const SizedBox(height: 22),
          Text(
            'The story',
            style: TextStyle(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.8,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            post.description,
            style: const TextStyle(
              fontSize: 22,
              height: 1.5,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Ingredients', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: post.ingredients.map((ingredient) => Chip(label: Text(ingredient))).toList(),
                  ),
                ],
              ),
            ),
          ),
          if (post.instructions.isNotEmpty) ...[
            const SizedBox(height: 18),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Instructions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    ...List.generate(
                      post.instructions.length,
                      (index) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 14,
                              child: Text('${index + 1}'),
                            ),
                            const SizedBox(width: 10),
                            Expanded(child: Text(post.instructions[index])),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 18),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  const Text('Give a rating', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 4,
                    children: List.generate(
                      5,
                      (index) => IconButton(
                        onPressed: _ratingPending || _currentUserId == null
                            ? null
                            : () => _rate((index + 1).toDouble()),
                        icon: Icon(
                          index < post.rating.round()
                              ? Icons.star_rounded
                              : Icons.star_border_rounded,
                          size: 32,
                          color: Colors.amber,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text('Current rating: ${post.rating > 0 ? post.rating.toStringAsFixed(1) : 'New'}'),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: _currentUserId == null || _saving ? null : _savePost,
                    child: Text(_saving ? 'Saving...' : 'Save to list'),
                  ),
                  const SizedBox(height: 18),
                  TextField(
                    controller: _commentController,
                    minLines: 1,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      hintText: 'What did you think of this recipe?',
                    ),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: _currentUserId == null || _commenting ? null : _comment,
                    child: Text(_commenting ? 'Posting...' : 'Post comment'),
                  ),
                ],
              ),
            ),
          ),
          if (post.comments.isNotEmpty) ...[
            const SizedBox(height: 18),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Comments', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    ...post.comments.map(
                      (comment) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Text(comment),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _DetailImage extends StatelessWidget {
  const _DetailImage({required this.imageUrl});

  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    Widget fallback() => ColoredBox(
          color: Theme.of(context).dividerColor,
          child: const Icon(Icons.bakery_dining_rounded, size: 52),
        );

    if (imageUrl == null || imageUrl!.isEmpty) {
      return fallback();
    }

    if (imageUrl!.startsWith('data:image')) {
      final parts = imageUrl!.split(',');
      if (parts.length == 2) {
        try {
          return Image.memory(
            base64Decode(parts[1]),
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => fallback(),
          );
        } catch (_) {
          return fallback();
        }
      }
    }

    return Image.network(
      imageUrl!,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => fallback(),
    );
  }
}
