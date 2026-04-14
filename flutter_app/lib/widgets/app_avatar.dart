import 'dart:convert';

import 'package:flutter/material.dart';

import '../models/app_user.dart';

class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    required this.user,
    this.radius = 24,
  });

  final AppUser user;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final imageUrl = user.profilePictureUrl;
    if (imageUrl != null && imageUrl.isNotEmpty) {
      if (imageUrl.startsWith('data:image')) {
        final parts = imageUrl.split(',');
        if (parts.length == 2) {
          try {
            return CircleAvatar(
              radius: radius,
              backgroundImage: MemoryImage(base64Decode(parts[1])),
            );
          } catch (_) {}
        }
      }

      return CircleAvatar(
        radius: radius,
        backgroundImage: NetworkImage(imageUrl),
        onBackgroundImageError: (_, __) {},
      );
    }

    return CircleAvatar(
      radius: radius,
      child: Text(
        user.initials.isEmpty ? '?' : user.initials,
        style: const TextStyle(fontWeight: FontWeight.w800),
      ),
    );
  }
}
