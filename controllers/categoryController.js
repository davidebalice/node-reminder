const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const AppError = require('../middlewares/error');
const catchAsync = require('../middlewares/catchAsync');

exports.getCategories = catchAsync(async (req, res, next) => {
  let filterData = {};
  if (req.query.key) {
    queryKey = req.query.key;
    const regex = new RegExp(req.query.key, 'i');
    filterData.name = { $regex: regex };
  }
  if (req.query.category) {
    queryCat = req.query.category;
    filterData.category = req.query.category;
  }
  const setLimit = 20;
  const limit = req.query.limit * 1 || setLimit;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;
  const categories = await Category.find(filterData).sort('order').skip(skip).limit(limit);

  const count = await Category.countDocuments();
  const totalPages = Math.ceil(count / limit);

  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Category added';
    } else if (req.query.m === '2') {
      message = 'Category deleted';
    }
  }

  const viewType = req.query.viewType;
  if (viewType === 'json') {
    res.json(categories);
  } else {
    res.status(200).json({
      title: 'Categories',
      categories,
      currentPage: page,
      page,
      limit,
      totalPages,
      message,
    });
  }
});

exports.getCategory = catchAsync(async (req, res, next) => {
  let filterData = {
    _id: new mongoose.Types.ObjectId(req.params.id),
  };

  const setLimit = 12;
  const limit = req.query.limit * 1 || setLimit;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  console.log('req.query.page');
  console.log(req.query);
  console.log(req.query.page);

  const category = await Category.find(filterData).skip(skip).limit(limit);

  const count = await Category.countDocuments(filterData);
  const totalPages = Math.ceil(count / limit);
  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Category added';
    } else if (req.query.m === '2') {
      message = 'Category deleted';
    }
  }

  res.status(200).json({
    title: 'Category',
    category,
    currentPage: page,
    page,
    limit,
    totalPages,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  try {
    req.body._id = new mongoose.Types.ObjectId();
    const { name } = req.body;
    console.log(name);
    await Category.create({
      name,
    });

    res.status(200).json({
      status: 'success',
      message: 'success',
    });
  } catch (err) {
    res.status(200).json({
      status: 'error',
      message: err.message,
    });
  }
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const doc = await Category.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
  });
});

exports.editCategory = catchAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    title: 'Edit category',
    status: 'success',
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'success',
    });
  } catch (err) {
    res.status(200).json({
      status: 'error',
      message: err.message,
    });
  }
});

exports.moveCategory = catchAsync(async (req, res, next) => {
  try {
    const { subcategoryId, direction } = req.body;

    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const subcategories = await Subcategory.find().sort({ order: 1 }).exec();
    const currentIndex = subcategories.findIndex((subcat) => subcat.id === subcategoryId);

    if (direction === 'up' && currentIndex > 0) {
      const tempOrder = subcategories[currentIndex].order;
      subcategories[currentIndex].order = subcategories[currentIndex - 1].order;
      subcategories[currentIndex - 1].order = tempOrder;
    } else if (direction === 'down' && currentIndex < subcategories.length - 1) {
      const tempOrder = subcategories[currentIndex].order;
      subcategories[currentIndex].order = subcategories[currentIndex + 1].order;
      subcategories[currentIndex + 1].order = tempOrder;
    } else {
      return res.status(400).json({ message: 'error' });
    }

    subcategories.sort((a, b) => a.order - b.order);

    subcategories.forEach((subcat, index) => {
      subcat.order = index + 1;
    });

    await Promise.all(
      subcategories.map((subcat) => Subcategory.findOneAndUpdate({ _id: subcat._id }, { order: subcat.order }))
    );

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'error' });
  }
});

exports.activeCategory = catchAsync(async (req, res, next) => {
  const doc = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
});
