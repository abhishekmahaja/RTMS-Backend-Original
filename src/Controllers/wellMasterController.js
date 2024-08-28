import Well from "../Models/wellMasterModel.js";

// Add a new well
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

// Update a well by ID
export const updateWell = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWell = await Well.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure validations are run on update
    });

    if (!updatedWell) {
      return res.status(404).json({
        success: false,
        message: "Well not found",
      });
    }

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

// Delete a well by ID
export const deleteWell = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWell = await Well.findByIdAndDelete(id);

    if (!deletedWell) {
      return res.status(404).json({
        success: false,
        message: "Well not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Well deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting well",
    });
  }
};

// Get all wells
export const getAllWells = async (req, res) => {
  try {
    const wells = await Well.find();
    res.status(200).json({
      success: true,
      message: "All data found successfully",
      wells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching wells",
    });
  }
};

// Get a single well by ID
export const getOneWell = async (req, res) => {
  try {
    const { id } = req.params;
    const well = await Well.findById(id);

    if (!well) {
      return res.status(404).json({
        success: false,
        message: "Well not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found successfully",
      well,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching well",
    });
  }
};
