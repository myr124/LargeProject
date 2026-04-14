import 'package:flutter/material.dart';

import '../models/activity_item.dart';
import '../models/app_user.dart';
import '../models/post.dart';
import '../models/trending_ingredient.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_avatar.dart';
import '../widgets/post_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.onOpenPost,
    required this.onOpenProfile,
  });

  final void Function(String postId) onOpenPost;
  final Future<void> Function([String? userId]) onOpenProfile;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _loading = true;
  String? _currentUserId;
  List<Post> _popular = const [];
  List<Post> _userPosts = const [];
  List<Post> _suggestedPosts = const [];
  List<ActivityItem> _activity = const [];
  List<TrendingIngredient> _ingredients = const [];
  AppUser? _currentUser;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final userId = await ApiService.resolveCurrentUserId();
    final allPosts = await ApiService.getAllPosts();

    AppUser? user;
    List<Post> userPosts = const [];
    List<Post> suggestedPosts = const [];
    List<ActivityItem> activity = const [];
    List<TrendingIngredient> ingredients = const [];

    if (userId != null) {
      final futures = await Future.wait<dynamic>([
        ApiService.getUserInfo(userId),
        ApiService.getPostsByUser(userId),
        ApiService.getSuggestedPosts(userId),
        ApiService.getFriendActivity(userId),
        ApiService.getTrendingIngredients(),
      ]);
      user = futures[0] as AppUser?;
      userPosts = futures[1] as List<Post>;
      suggestedPosts = futures[2] as List<Post>;
      activity = futures[3] as List<ActivityItem>;
      ingredients = futures[4] as List<TrendingIngredient>;
    } else {
      ingredients = await ApiService.getTrendingIngredients();
    }

    if (!mounted) return;
    setState(() {
      _currentUserId = userId;
      _popular = allPosts.take(4).toList();
      _currentUser = user;
      _userPosts = userPosts;
      _suggestedPosts = suggestedPosts;
      _activity = activity;
      _ingredients = ingredients;
      _loading = false;
    });
  }

  String _timeAgo(DateTime? date) {
    if (date == null) return 'Recently';
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${date.month}/${date.day}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).extension<BreadBoxdColors>()!;

    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 28),
            decoration: BoxDecoration(
              color: colors.muted.withValues(alpha: 0.5),
              border: Border(
                bottom: BorderSide(color: colors.border),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Column(
                    children: [
                      Text(
                        'Your kitchen, your story',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Track, review, and discover\nrecipes you love',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 30,
                          height: 1.2,
                          color: colors.foreground,
                          fontFamily: 'Georgia',
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Log every dish you have cooked, rate your favorites, and find your next culinary obsession.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: colors.foreground.withValues(alpha: 0.75),
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          _Section(
            title: 'Popular this week',
            child: _popular.isEmpty
                ? const _EmptyCard(message: 'No recipes found yet.')
                : LayoutBuilder(
                    builder: (context, constraints) {
                      final availableWidth = constraints.maxWidth;
                      final cardWidth = availableWidth < 700
                          ? (availableWidth - 64).clamp(220.0, 300.0)
                          : 240.0;
                      final horizontalPadding =
                          availableWidth < 700 ? (availableWidth - cardWidth) / 2 : 20.0;

                      return SizedBox(
                        height: 248,
                        child: ListView.separated(
                          padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                          scrollDirection: Axis.horizontal,
                          itemCount: _popular.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 14),
                          itemBuilder: (context, index) {
                            return SizedBox(
                              width: cardWidth,
                              child: PostCard(
                                post: _popular[index],
                                onTap: () => widget.onOpenPost(_popular[index].id),
                                imageHeight: 126,
                                descriptionMaxLines: 1,
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ),
          _Section(
            title: 'Friend activity',
            child: _activity.isEmpty
                ? _EmptyCard(
                    message: _currentUserId == null
                        ? 'Log in to see friend activity.'
                        : 'Follow some cooks to populate this feed.',
                  )
                : _CenteredContent(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: _activity
                              .map(
                                (item) => ListTile(
                                  contentPadding: EdgeInsets.zero,
                                  onTap: () => widget.onOpenPost(item.postId),
                                  leading: item.author == null
                                      ? const CircleAvatar(child: Text('?'))
                                      : AppAvatar(user: item.author!, radius: 20),
                                  title: Text(
                                    '${item.author?.fullName ?? 'Someone'} posted ${item.postTitle}',
                                    style: const TextStyle(fontWeight: FontWeight.w700),
                                  ),
                                  subtitle: Text(_timeAgo(item.createdAt)),
                                  trailing: item.postRating > 0
                                      ? Text(
                                          '★ ${item.postRating.toStringAsFixed(1)}',
                                          style: TextStyle(
                                            color: Theme.of(context).colorScheme.primary,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        )
                                      : null,
                                ),
                              )
                              .toList(),
                        ),
                      ),
                    ),
                  ),
          ),
          _CenteredContent(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 880;
                  final stats = _StatsCard(user: _currentUser, posts: _userPosts.length);
                  final trends = _TrendsCard(
                    ingredients: _ingredients,
                    suggestions: _suggestedPosts,
                    onOpenPost: widget.onOpenPost,
                  );
                  if (isWide) {
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(flex: 2, child: stats),
                        const SizedBox(width: 16),
                        Expanded(child: trends),
                      ],
                    );
                  }
                  return Column(
                    children: [
                      stats,
                      const SizedBox(height: 16),
                      trends,
                    ],
                  );
                },
              ),
            ),
          ),
          if (_currentUser != null)
            _CenteredContent(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: OutlinedButton.icon(
                  onPressed: () => widget.onOpenProfile(_currentUser!.id),
                  icon: const Icon(Icons.person_rounded),
                  label: const Text('Open your profile'),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _CenteredContent extends StatelessWidget {
  const _CenteredContent({
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 960),
        child: child,
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _StatsCard extends StatelessWidget {
  const _StatsCard({required this.user, required this.posts});

  final AppUser? user;
  final int posts;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Your stats', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 14),
            Wrap(
              spacing: 14,
              runSpacing: 14,
              children: [
                _Metric(label: 'Posts', value: posts.toString()),
                _Metric(label: 'Followers', value: '${user?.followerCount ?? 0}'),
                _Metric(label: 'Following', value: '${user?.followingCount ?? 0}'),
                _Metric(label: 'Saved', value: '${user?.savedPosts.length ?? 0}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 130,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).dividerColor),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(label),
        ],
      ),
    );
  }
}

class _TrendsCard extends StatelessWidget {
  const _TrendsCard({
    required this.ingredients,
    required this.suggestions,
    required this.onOpenPost,
  });

  final List<TrendingIngredient> ingredients;
  final List<Post> suggestions;
  final void Function(String postId) onOpenPost;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Trending ingredients', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            if (ingredients.isEmpty)
              const Text('Nothing trending yet.')
            else
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ingredients
                    .map((item) => Chip(label: Text('${item.name} (${item.count})')))
                    .toList(),
              ),
            const SizedBox(height: 20),
            const Text('Suggested posts', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            if (suggestions.isEmpty)
              const Text('No suggestions yet.')
            else
              Column(
                children: suggestions
                    .map(
                      (post) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        onTap: () => onOpenPost(post.id),
                        title: Text(post.title, style: const TextStyle(fontWeight: FontWeight.w700)),
                        subtitle: Text(
                          post.description,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: Text(
                          post.rating > 0 ? post.rating.toStringAsFixed(1) : 'New',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Text(message),
        ),
      ),
    );
  }
}
