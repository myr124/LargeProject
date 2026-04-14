class TrendingIngredient {
  const TrendingIngredient({
    required this.name,
    required this.count,
  });

  final String name;
  final int count;

  factory TrendingIngredient.fromJson(Map<String, dynamic> json) {
    return TrendingIngredient(
      name: (json['name'] ?? '').toString(),
      count: (json['count'] as num?)?.toInt() ?? 0,
    );
  }
}
