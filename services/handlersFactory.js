const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filerObj) {
      filter = req.filerObj;
    }
    const documentsCounts = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    //excute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });
exports.getOne = (model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await model.create(req.body);
    res.status(201).json({ data: newDoc });
  });
exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });
exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    document.deleteOne();
    res.status(204).send();
  });
