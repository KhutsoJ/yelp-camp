const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
   const campgrounds = await Campground.find();
   res.render('campgrounds/index', { campgrounds });
}

module.exports.getCreateForm = (req, res) => {
   res.render('campgrounds/create');
}

module.exports.createCampground = async (req, res, next) => {
   const campground = new Campground(req.body.campground);
   campground.author = req.user._id;
   await campground.save();
   req.flash('success', 'Successfully made a new Campground!');
   res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showDetails = async (req, res) => {
   const campground = await Campground.findById(req.params.id)
   .populate({
      path: 'reviews',
      populate: {
         path: 'author'
      }
   })
   .populate('author');
   if (!campground) {
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { campground });
}

module.exports.getEditForm = async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   if (!campground) {
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { campground });
}

module.exports.updateDetails = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
   req.flash('success', 'Successfully updated the Campground');
   res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success', 'Campground deleted');
   res.redirect(`/campgrounds`);
}
