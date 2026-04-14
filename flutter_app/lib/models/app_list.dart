import 'post.dart';

class AppList {
  const AppList({
    required this.id,
    required this.userId,
    required this.name,
    this.postIds = const [],
    this.posts = const [],
    this.createdAt,
  });

  final String id;
  final String userId;
  final String name;
  final List<String> postIds;
  final List<Post> posts;
  final DateTime? createdAt;

  AppList copyWith({
    List<String>? postIds,
    List<Post>? posts,
  }) {
    return AppList(
      id: id,
      userId: userId,
      name: name,
      postIds: postIds ?? this.postIds,
      posts: posts ?? this.posts,
      createdAt: createdAt,
    );
  }

  factory AppList.fromJson(Map<String, dynamic> json) {
    final rawPosts = json['posts'] as List<dynamic>? ?? const [];
    final rawPostIds = json['posts'] as List<dynamic>? ?? const [];

    return AppList(
      id: (json['_id'] ?? '').toString(),
      userId: (json['user_id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      postIds: rawPostIds
          .where((value) => value is! Map<String, dynamic>)
          .map((value) => value.toString())
          .toList(),
      posts: rawPosts
          .whereType<Map<String, dynamic>>()
          .map(Post.fromJson)
          .toList(),
      createdAt: json['created_at'] == null
          ? null
          : DateTime.tryParse(json['created_at'].toString()),
    );
  }
}
