import Well from "../Models/wellMasterModel.js";

//to add well to show well monitor
export const addWell = async (req, res) => {
  try {
    const newWell = new Well(req.body);
    await newWell.save();
    res.status(201).json({
      success: true,
      message: "Well added successfully",
      well: newWell,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error adding well",
    });
  }
};

//to Update well by id to show well monitor
export const updateWell = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWell = await Well.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Well updated successfully",
      well: updatedWell,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating well",
    });
  }
};

//to delete well by id to show well monitor
export const deleteWell = async (req, res) => {
  try {
    const { id } = req.params;
    await Well.findByIdAndDelete(id);
    res.status(200).json({ message: "Well deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting well", error });
  }
};

//to show {get} all well to show well monitor
export const getAllWells = async (req, res) => {
  try {
    const wells = await Well.find();
    res.status(200).json({
      success: true,
      message: "Data Found All Successfully",
      wells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching wells",
    });
  }
};

//to get well by id to show well monitor
export const getOneWell = async (req, res) => {
  try {
    const { id } = req.params;
    const wells = await Well.findOne({
      _id: id,
    });
    res.status(200).json({
      success: true,
      message: "Data Found Successfully",
      wells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Wells",
    });
  }
};
