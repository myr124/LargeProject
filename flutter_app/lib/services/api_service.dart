import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/activity_item.dart';
import '../models/app_list.dart';
import '../models/app_user.dart';
import '../models/post.dart';
import '../models/trending_ingredient.dart';
import 'session_service.dart';

class ApiService {
  static const String baseUrl = 'http://134.209.126.33:5001/api';
  static const Duration _requestTimeout = Duration(seconds: 12);

  static Future<dynamic> _get(String endpoint) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/$endpoint'),
            headers: const {'Content-Type': 'application/json'},
          )
          .timeout(_requestTimeout);
      return _decodeResponse(response);
    } catch (error) {
      return _networkError(error);
    }
  }

  static Future<dynamic> _post(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/$endpoint'),
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode(data),
          )
          .timeout(_requestTimeout);
      return _decodeResponse(response);
    } catch (error) {
      return _networkError(error);
    }
  }

  static dynamic _decodeResponse(http.Response response) {
    final body = response.body.isEmpty ? null : jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    }
    if (body is Map<String, dynamic>) {
      return body;
    }
    return {'error': 'Request failed with status ${response.statusCode}'};
  }

  static Map<String, dynamic> _networkError(Object error) {
    final message = error.toString();
    if (message.contains('Connection failed')) {
      return {
        'error':
            'Could not reach the backend at $baseUrl. Make sure the server is running and the app has network permission.'
      };
    }
    if (message.contains('TimeoutException')) {
      return {'error': 'Request timed out. Check whether the backend is responding.'};
    }
    return {'error': 'Network request failed: $message'};
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final result = await _post('login', {
      'email': email,
      'password': password,
    });

    if (result is Map<String, dynamic> && result['accessToken'] != null) {
      await SessionService.saveToken(result['accessToken'].toString());
      await SessionService.saveLoginEmail(email);
      await resolveCurrentUserId(forceRefresh: true);
      return {'success': true};
    }

    return {
      'success': false,
      'error': (result as Map<String, dynamic>)['error'] ?? 'Login failed',
    };
  }

  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String username,
    required String email,
    required String password,
  }) async {
    final result = await _post('register', {
      'firstName': firstName,
      'lastName': lastName,
      'username': username,
      'email': email,
      'password': password,
    });

    if (result is Map<String, dynamic> && result['message'] != null) {
      return {'success': true, 'message': result['message']};
    }

    return {
      'success': false,
      'error': (result as Map<String, dynamic>)['error'] ?? 'Registration failed',
    };
  }

  static Future<List<Post>> getAllPosts() async {
    final result = await _get('getAllPosts');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(Post.fromJson)
        .toList();
  }

  static Future<Post?> getPostById(String postId) async {
    final result = await _get('getPostsById/$postId');
    if (result is List && result.isNotEmpty && result.first is Map<String, dynamic>) {
      return Post.fromJson(result.first as Map<String, dynamic>);
    }
    return null;
  }

  static Future<List<Post>> getPostsByUser(String userId) async {
    final result = await _get('getPostsByUser/$userId');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(Post.fromJson)
        .toList();
  }

  static Future<AppUser?> getUserInfo(String userId) async {
    final result = await _get('getUserInfo/$userId');
    if (result is Map<String, dynamic> && result['error'] == null) {
      return AppUser.fromJson(result);
    }
    return null;
  }

  static Future<List<AppUser>> getAllUsers() async {
    final result = await _get('getAllUsers');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(AppUser.fromJson)
        .toList();
  }

  static Future<String?> resolveCurrentUserId({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final existing = await SessionService.currentUserId();
      if (existing != null) return existing;
    }

    final users = await getAllUsers();
    if (users.isEmpty) return null;

    final email = await SessionService.getLoginEmail();
    if (email != null && email.isNotEmpty) {
      for (final user in users) {
        if (user.email.toLowerCase() == email.toLowerCase()) {
          await SessionService.saveResolvedUserId(user.id);
          return user.id;
        }
      }
    }

    final identity = await SessionService.tokenIdentity();
    final tokenUserId = identity['userId']?.trim();
    if (tokenUserId != null && tokenUserId.isNotEmpty) {
      for (final user in users) {
        if (user.legacyId == tokenUserId) {
          await SessionService.saveResolvedUserId(user.id);
          return user.id;
        }
      }
    }

    final firstName = identity['firstName']?.trim().toLowerCase();
    final lastName = identity['lastName']?.trim().toLowerCase();
    if (firstName != null && lastName != null) {
      for (final user in users) {
        if (user.firstName.trim().toLowerCase() == firstName &&
            user.lastName.trim().toLowerCase() == lastName) {
          await SessionService.saveResolvedUserId(user.id);
          return user.id;
        }
      }
    }

    return null;
  }

  static Future<List<String>> getFollowing(String userId) async {
    final result = await _get('getFollowing/$userId');
    if (result is! List) return const [];
    return result.map((value) => value.toString()).toList();
  }

  static Future<List<ActivityItem>> getFriendActivity(String userId) async {
    final result = await _get('getFriendActivity/$userId');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(ActivityItem.fromJson)
        .toList();
  }

  static Future<List<TrendingIngredient>> getTrendingIngredients() async {
    final result = await _get('getTrendingIngredients');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(TrendingIngredient.fromJson)
        .toList();
  }

  static Future<List<Post>> getSuggestedPosts(String userId) async {
    final result = await _get('getSuggestedPosts/$userId');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(Post.fromJson)
        .toList();
  }

  static Future<Map<String, dynamic>> follow({
    required String followerId,
    required String followingId,
    required bool shouldFollow,
  }) async {
    final result = await _post(
      shouldFollow ? 'follow' : 'unfollow',
      {
        'follower_id': followerId,
        'following_id': followingId,
      },
    );
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> ratePost({
    required String userId,
    required String postId,
    required double rating,
  }) async {
    final result = await _post('rate', {
      'user_id': userId,
      'post_id': postId,
      'rating': rating,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> savePost({
    required String userId,
    required String postId,
  }) async {
    final result = await _post('savePost', {
      'userId': userId,
      'postId': postId,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> unsavePost({
    required String userId,
    required String postId,
  }) async {
    final result = await _post('unsavePost', {
      'userId': userId,
      'postId': postId,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> comment({
    required String userId,
    required String postId,
    required String comment,
  }) async {
    final result = await _post('comment', {
      'userId': userId,
      'postId': postId,
      'comment': comment,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> createPost({
    required String authorId,
    required String title,
    required String description,
    required List<String> ingredients,
    required List<String> imageUrls,
    required List<String> instructions,
    required List<String> tags,
    double? selfRating,
  }) async {
    final result = await _post('postCreation', {
      'author_id': authorId,
      'title': title,
      'description': description,
      'ingredients': ingredients,
      'image_urls': imageUrls,
      'instructions': instructions,
      'tags': tags,
      if (selfRating != null && selfRating > 0) 'self_rating': selfRating,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> updateUser({
    required String userId,
    required String firstName,
    required String lastName,
    required String username,
    String? profilePictureUrl,
  }) async {
    final result = await _post('updateUser', {
      'userId': userId,
      'firstName': firstName,
      'lastName': lastName,
      'username': username,
      'profilePictureUrl': profilePictureUrl ?? '',
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> deletePost({
    required String userId,
    required String postId,
  }) async {
    final result = await _post('deletePost', {
      'userId': userId,
      'postId': postId,
    });
    return result as Map<String, dynamic>;
  }

  static Future<List<AppList>> getLists(String userId) async {
    final result = await _get('getLists/$userId');
    if (result is! List) return const [];
    return result
        .whereType<Map<String, dynamic>>()
        .map(AppList.fromJson)
        .toList();
  }

  static Future<AppList?> getListById(String listId) async {
    final result = await _get('getListById/$listId');
    if (result is Map<String, dynamic> && result['error'] == null) {
      return AppList.fromJson(result);
    }
    return null;
  }

  static Future<Map<String, dynamic>> createList({
    required String userId,
    required String name,
  }) async {
    final result = await _post('createList', {
      'userId': userId,
      'name': name,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> addToList({
    required String listId,
    required String postId,
  }) async {
    final result = await _post('addToList', {
      'listId': listId,
      'postId': postId,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> removeFromList({
    required String listId,
    required String postId,
  }) async {
    final result = await _post('removeFromList', {
      'listId': listId,
      'postId': postId,
    });
    return result as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> deleteList({
    required String listId,
    required String userId,
  }) async {
    final result = await _post('deleteList', {
      'listId': listId,
      'userId': userId,
    });
    return result as Map<String, dynamic>;
  }
}
