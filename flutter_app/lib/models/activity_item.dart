import 'app_user.dart';

class ActivityItem {
  const ActivityItem({
    required this.postId,
    required this.postTitle,
    required this.postRating,
    this.createdAt,
    this.author,
  });

  final String postId;
  final String postTitle;
  final double postRating;
  final DateTime? createdAt;
  final AppUser? author;

  factory ActivityItem.fromJson(Map<String, dynamic> json) {
    return ActivityItem(
      postId: (json['postId'] ?? '').toString(),
      postTitle: (json['postTitle'] ?? '').toString(),
      postRating: (json['postRating'] as num?)?.toDouble() ?? 0,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.tryParse(json['createdAt'].toString()),
      author: json['author'] is Map<String, dynamic>
          ? AppUser.fromJson(json['author'] as Map<String, dynamic>)
          : null,
    );
  }
}
