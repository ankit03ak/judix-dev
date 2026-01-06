import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, author, status, publishedDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const post = await Post.create({
      title,
      content,
      author: author || req.user.name,
      status,
      publishedDate: status === 'published' ? publishedDate || new Date() : null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this post',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }
    if (req.body.status === 'published' && post.status !== 'published') {
      req.body.publishedDate = req.body.publishedDate || new Date();
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: post,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
