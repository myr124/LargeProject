class Post {
  const Post({
    required this.id,
    required this.authorId,
    required this.title,
    required this.description,
    this.ingredients = const [],
    this.instructions = const [],
    this.tags = const [],
    this.imageUrls = const [],
    this.comments = const [],
    this.authorSnippet,
    this.rating = 0,
    this.selfRating = 0,
    this.createdAt,
  });

  final String id;
  final String authorId;
  final String title;
  final String description;
  final List<String> ingredients;
  final List<String> instructions;
  final List<String> tags;
  final List<String> imageUrls;
  final List<String> comments;
  final Map<String, dynamic>? authorSnippet;
  final double rating;
  final double selfRating;
  final DateTime? createdAt;

  Post copyWith({
    double? rating,
    List<String>? comments,
  }) {
    return Post(
      id: id,
      authorId: authorId,
      title: title,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      tags: tags,
      imageUrls: imageUrls,
      comments: comments ?? this.comments,
      authorSnippet: authorSnippet,
      rating: rating ?? this.rating,
      selfRating: selfRating,
      createdAt: createdAt,
    );
  }

  factory Post.fromJson(Map<String, dynamic> json) {
    List<String> asStringList(dynamic value) {
      if (value is List) {
        return value.map((item) => item.toString()).toList();
      }
      if (value == null) {
        return const [];
      }
      return [value.toString()];
    }

    return Post(
      id: (json['_id'] ?? '').toString(),
      authorId: (json['author_id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      ingredients: asStringList(json['ingredients']),
      instructions: asStringList(json['instructions']),
      tags: asStringList(json['tags']),
      imageUrls: asStringList(json['image_urls']),
      comments: asStringList(json['comments']),
      authorSnippet: json['author_snippet'] is Map<String, dynamic>
          ? json['author_snippet'] as Map<String, dynamic>
          : null,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      selfRating: (json['self_rating'] as num?)?.toDouble() ?? 0,
      createdAt: json['created_at'] == null
          ? null
          : DateTime.tryParse(json['created_at'].toString()),
    );
  }
}
