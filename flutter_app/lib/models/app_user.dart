class AppUser {
  const AppUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.username,
    this.legacyId,
    this.profilePictureUrl,
    this.followerCount = 0,
    this.followingCount = 0,
    this.postCount = 0,
    this.savedPosts = const [],
  });

  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String username;
  final String? legacyId;
  final String? profilePictureUrl;
  final int followerCount;
  final int followingCount;
  final int postCount;
  final List<String> savedPosts;

  String get fullName => '$firstName $lastName';

  String get initials {
    final first = firstName.isNotEmpty ? firstName[0] : '';
    final last = lastName.isNotEmpty ? lastName[0] : '';
    return '$first$last'.toUpperCase();
  }

  AppUser copyWith({
    String? firstName,
    String? lastName,
    String? username,
    String? profilePictureUrl,
    int? followerCount,
    int? followingCount,
    int? postCount,
    List<String>? savedPosts,
  }) {
    return AppUser(
      id: id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email,
      username: username ?? this.username,
      legacyId: legacyId,
      profilePictureUrl: profilePictureUrl ?? this.profilePictureUrl,
      followerCount: followerCount ?? this.followerCount,
      followingCount: followingCount ?? this.followingCount,
      postCount: postCount ?? this.postCount,
      savedPosts: savedPosts ?? this.savedPosts,
    );
  }

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      firstName: (json['firstName'] ?? '').toString(),
      lastName: (json['lastName'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      username: (json['username'] ?? '').toString(),
      legacyId: json['id']?.toString(),
      profilePictureUrl: json['profilePictureUrl']?.toString(),
      followerCount: (json['followerCount'] as num?)?.toInt() ?? 0,
      followingCount: (json['followingCount'] as num?)?.toInt() ?? 0,
      postCount: (json['postCount'] as num?)?.toInt() ?? 0,
      savedPosts: (json['savedPosts'] as List<dynamic>? ?? const [])
          .map((value) => value.toString())
          .toList(),
    );
  }
}
