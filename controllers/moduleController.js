// moduleController.js
import Module from "../models/module.js";

export const createModule = async (req, res) => {
  try {
    console.log(req.body);

    const moduleData = new Module({
      name: req.body.name,
      moduleGrammar: req.body.moduleGrammar,
      videos: req.body.videos,
      text: {
        title: req.body.text.title,
        content: req.body.text.content,
      },
      vocabulary: req.body.vocabulary,
      exercises: req.body.exercises,
    });

    const result = await moduleData.save();
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOneModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOneModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.moduleId,
      req.body,
      { new: true }
    );
    if (!updatedModule) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(updatedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOneModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.moduleId);
    if (!deletedModule) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json("Module deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
