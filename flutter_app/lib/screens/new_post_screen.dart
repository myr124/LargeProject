import 'package:flutter/material.dart';

import '../services/api_service.dart';

class NewPostScreen extends StatefulWidget {
  const NewPostScreen({
    super.key,
    required this.onCreated,
  });

  final void Function(String postId) onCreated;

  @override
  State<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends State<NewPostScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _chipInputController = TextEditingController();
  final _imageInputController = TextEditingController();
  final _stepInputController = TextEditingController();
  final _tagInputController = TextEditingController();

  bool _submitting = false;
  double _selfRating = 0;
  List<String> _ingredients = [];
  List<String> _imageUrls = [];
  List<String> _instructions = [];
  List<String> _tags = [];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _chipInputController.dispose();
    _imageInputController.dispose();
    _stepInputController.dispose();
    _tagInputController.dispose();
    super.dispose();
  }

  void _addItem(TextEditingController controller, void Function(String value) onAdd) {
    final value = controller.text.trim();
    if (value.isEmpty) return;
    onAdd(value);
    controller.clear();
  }

  Future<void> _submit() async {
    final authorId = await ApiService.resolveCurrentUserId();
    if (authorId == null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must be logged in to post.')),
      );
      return;
    }
    if (_titleController.text.trim().isEmpty ||
        _descriptionController.text.trim().isEmpty ||
        _ingredients.isEmpty ||
        _imageUrls.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title, description, ingredients, and an image are required.')),
      );
      return;
    }

    setState(() => _submitting = true);
    final result = await ApiService.createPost(
      authorId: authorId,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      ingredients: _ingredients,
      imageUrls: _imageUrls,
      instructions: _instructions,
      tags: _tags,
      selfRating: _selfRating == 0 ? null : _selfRating,
    );

    if (!mounted) return;
    setState(() => _submitting = false);

    if (result['error'] != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['error'].toString())),
      );
      return;
    }

    final postId = result['postId']?.toString();
    if (postId != null) {
      widget.onCreated(postId);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: _titleController,
                  decoration: const InputDecoration(labelText: 'Title'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _descriptionController,
                  minLines: 4,
                  maxLines: 6,
                  decoration: const InputDecoration(labelText: 'Description'),
                ),
                const SizedBox(height: 18),
                _ChipEditor(
                  label: 'Ingredients',
                  controller: _chipInputController,
                  items: _ingredients,
                  onAdd: () => _addItem(_chipInputController, (value) {
                    setState(() => _ingredients = [..._ingredients, value]);
                  }),
                  onRemove: (value) =>
                      setState(() => _ingredients = _ingredients.where((item) => item != value).toList()),
                ),
                const SizedBox(height: 18),
                _ChipEditor(
                  label: 'Image URLs',
                  controller: _imageInputController,
                  items: _imageUrls,
                  onAdd: () => _addItem(_imageInputController, (value) {
                    setState(() => _imageUrls = [..._imageUrls, value]);
                  }),
                  onRemove: (value) =>
                      setState(() => _imageUrls = _imageUrls.where((item) => item != value).toList()),
                ),
                const SizedBox(height: 18),
                _ChipEditor(
                  label: 'Tags',
                  controller: _tagInputController,
                  items: _tags,
                  onAdd: () => _addItem(_tagInputController, (value) {
                    setState(() => _tags = [..._tags, value]);
                  }),
                  onRemove: (value) =>
                      setState(() => _tags = _tags.where((item) => item != value).toList()),
                ),
                const SizedBox(height: 18),
                _StepEditor(
                  controller: _stepInputController,
                  steps: _instructions,
                  onAdd: () => _addItem(_stepInputController, (value) {
                    setState(() => _instructions = [..._instructions, value]);
                  }),
                  onRemove: (index) => setState(() {
                    final next = List<String>.from(_instructions);
                    next.removeAt(index);
                    _instructions = next;
                  }),
                ),
                const SizedBox(height: 18),
                const Text('Your rating', style: TextStyle(fontWeight: FontWeight.w800)),
                Wrap(
                  spacing: 4,
                  children: List.generate(
                    5,
                    (index) => IconButton(
                      onPressed: () => setState(() => _selfRating = index + 1.0),
                      icon: Icon(
                        index < _selfRating ? Icons.star_rounded : Icons.star_border_rounded,
                        color: Colors.amber,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  child: Text(_submitting ? 'Posting...' : 'Post creation'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _ChipEditor extends StatelessWidget {
  const _ChipEditor({
    required this.label,
    required this.controller,
    required this.items,
    required this.onAdd,
    required this.onRemove,
  });

  final String label;
  final TextEditingController controller;
  final List<String> items;
  final VoidCallback onAdd;
  final void Function(String value) onRemove;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                onSubmitted: (_) => onAdd(),
              ),
            ),
            const SizedBox(width: 8),
            SizedBox(
              width: 72,
              height: 48,
              child: OutlinedButton(
                onPressed: onAdd,
                style: OutlinedButton.styleFrom(
                  minimumSize: Size.zero,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('Add'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: items
              .map(
                (value) => InputChip(
                  label: Text(value),
                  onDeleted: () => onRemove(value),
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}

class _StepEditor extends StatelessWidget {
  const _StepEditor({
    required this.controller,
    required this.steps,
    required this.onAdd,
    required this.onRemove,
  });

  final TextEditingController controller;
  final List<String> steps;
  final VoidCallback onAdd;
  final void Function(int index) onRemove;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Instructions', style: TextStyle(fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                onSubmitted: (_) => onAdd(),
              ),
            ),
            const SizedBox(width: 8),
            SizedBox(
              width: 72,
              height: 48,
              child: OutlinedButton(
                onPressed: onAdd,
                style: OutlinedButton.styleFrom(
                  minimumSize: Size.zero,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('Add'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...List.generate(
          steps.length,
          (index) => ListTile(
            contentPadding: EdgeInsets.zero,
            leading: CircleAvatar(radius: 14, child: Text('${index + 1}')),
            title: Text(steps[index]),
            trailing: IconButton(
              onPressed: () => onRemove(index),
              icon: const Icon(Icons.close_rounded),
            ),
          ),
        ),
      ],
    );
  }
}
