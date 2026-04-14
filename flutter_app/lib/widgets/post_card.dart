import 'dart:convert';

import 'package:flutter/material.dart';

import '../models/post.dart';
import '../theme/app_theme.dart';

class PostCard extends StatelessWidget {
  const PostCard({
    super.key,
    required this.post,
    this.onTap,
    this.subtitle,
    this.imageHeight,
    this.descriptionMaxLines = 2,
  });

  final Post post;
  final VoidCallback? onTap;
  final Widget? subtitle;
  final double? imageHeight;
  final int descriptionMaxLines;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).extension<BreadBoxdColors>()!;
    final imageUrl = post.imageUrls.isNotEmpty ? post.imageUrls.first : null;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (imageHeight != null)
              SizedBox(
                height: imageHeight,
                width: double.infinity,
                child: _PostImage(imageUrl: imageUrl, colors: colors),
              )
            else
              AspectRatio(
                aspectRatio: 16 / 10,
                child: _PostImage(imageUrl: imageUrl, colors: colors),
              ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    post.description,
                    maxLines: descriptionMaxLines,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: colors.foreground.withValues(alpha: 0.75)),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(Icons.star_rounded, size: 16, color: Theme.of(context).colorScheme.primary),
                      const SizedBox(width: 4),
                      Text(
                        post.rating > 0 ? post.rating.toStringAsFixed(1) : 'New',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                      if (subtitle != null) ...[
                        const Spacer(),
                        Flexible(child: subtitle!),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PostImage extends StatelessWidget {
  const _PostImage({
    required this.imageUrl,
    required this.colors,
  });

  final String? imageUrl;
  final BreadBoxdColors colors;

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return _PostPlaceholder(colors: colors);
    }

    if (imageUrl!.startsWith('data:image')) {
      final parts = imageUrl!.split(',');
      if (parts.length == 2) {
        try {
          final bytes = base64Decode(parts[1]);
          return Image.memory(
            bytes,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => _PostPlaceholder(colors: colors),
          );
        } catch (_) {
          return _PostPlaceholder(colors: colors);
        }
      }
    }

    return Image.network(
      imageUrl!,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => _PostPlaceholder(colors: colors),
    );
  }
}

class _PostPlaceholder extends StatelessWidget {
  const _PostPlaceholder({required this.colors});

  final BreadBoxdColors colors;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: colors.muted,
      child: Icon(Icons.bakery_dining_rounded, color: colors.foreground, size: 40),
    );
  }
}
