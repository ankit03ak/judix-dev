import Note from '../models/Note.js';

export const createNote = async (req, res) => {
  try {
    const { title, content, category, tags, color } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Note title is required',
      });
    }

    const note = await Note.create({
      title,
      content,
      category,
      tags,
      color,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully',
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    const query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this note',
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this note',
      });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
