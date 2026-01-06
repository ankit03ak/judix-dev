import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: '#fbbf24',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ user: 1, tags: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
