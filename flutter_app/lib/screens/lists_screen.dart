import 'package:flutter/material.dart';

import '../models/app_list.dart';
import '../services/api_service.dart';

class ListsScreen extends StatefulWidget {
  const ListsScreen({super.key});

  @override
  State<ListsScreen> createState() => _ListsScreenState();
}

class _ListsScreenState extends State<ListsScreen> {
  final _nameController = TextEditingController();
  bool _loading = true;
  String? _currentUserId;
  List<AppList> _lists = const [];
  final Map<String, AppList> _expandedLists = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final userId = await ApiService.resolveCurrentUserId();
    if (userId == null) {
      if (!mounted) return;
      setState(() {
        _currentUserId = null;
        _loading = false;
      });
      return;
    }
    final lists = await ApiService.getLists(userId);
    if (!mounted) return;
    setState(() {
      _currentUserId = userId;
      _lists = lists;
      _loading = false;
    });
  }

  Future<void> _createList() async {
    if (_currentUserId == null || _nameController.text.trim().isEmpty) return;
    final result = await ApiService.createList(
      userId: _currentUserId!,
      name: _nameController.text.trim(),
    );
    if (!mounted) return;
    if (result['error'] == null) {
      _nameController.clear();
      await _load();
    }
  }

  Future<void> _toggleExpand(AppList list) async {
    if (_expandedLists.containsKey(list.id)) {
      setState(() => _expandedLists.remove(list.id));
      return;
    }
    final loaded = await ApiService.getListById(list.id);
    if (!mounted || loaded == null) return;
    setState(() => _expandedLists[list.id] = loaded);
  }

  Future<void> _deleteList(AppList list) async {
    if (_currentUserId == null) return;
    await ApiService.deleteList(listId: list.id, userId: _currentUserId!);
    if (!mounted) return;
    await _load();
  }

  Future<void> _removePost(AppList list, String postId) async {
    await ApiService.removeFromList(listId: list.id, postId: postId);
    if (!mounted) return;
    final updated = await ApiService.getListById(list.id);
    if (!mounted || updated == null) return;
    setState(() => _expandedLists[list.id] = updated);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Lists')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _currentUserId == null
              ? const Center(child: Text('Log in to manage your lists.'))
              : ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              hintText: 'New list name',
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          width: 92,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: _createList,
                            style: ElevatedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: const Text('Create'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    if (_lists.isEmpty)
                      const Card(
                        child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Text('No lists yet. Create one above to get started.'),
                        ),
                      )
                    else
                      ..._lists.map((list) {
                        final expanded = _expandedLists[list.id];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Card(
                            child: ExpansionTile(
                              onExpansionChanged: (_) => _toggleExpand(list),
                              title: Text(list.name,
                                  style: const TextStyle(fontWeight: FontWeight.w800)),
                              subtitle: Text(
                                '${expanded?.posts.length ?? list.postIds.length} post${(expanded?.posts.length ?? list.postIds.length) == 1 ? '' : 's'}',
                              ),
                              trailing: IconButton(
                                onPressed: () => _deleteList(list),
                                icon: const Icon(Icons.delete_outline_rounded),
                              ),
                              children: [
                                if (expanded == null || expanded.posts.isEmpty)
                                  const Padding(
                                    padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
                                    child: Text('No posts in this list yet.'),
                                  )
                                else
                                  ...expanded.posts.map(
                                    (post) => ListTile(
                                      title: Text(post.title),
                                      subtitle: Text(
                                        post.description,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      trailing: IconButton(
                                        onPressed: () => _removePost(list, post.id),
                                        icon: const Icon(Icons.close_rounded),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      }),
                  ],
                ),
    );
  }
}
