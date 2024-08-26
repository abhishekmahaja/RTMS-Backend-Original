import {} from "../Models/wellMasterModel.js";

export const addWell = async (req, res) => {
  try {
    const newWell = new Well(req.body);
    await newWell.save();
    res.status(201).json({ message: "Well added successfully", well: newWell });
  } catch (error) {
    res.status(500).json({ message: "Error adding well", error });
  }
};
export const updateWell = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWell = await Well.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Well updated successfully", well: updatedWell });
  } catch (error) {
    res.status(500).json({ message: "Error updating well", error });
  }
};

export const deleteWell = async (req, res) => {
  try {
    const { id } = req.params;
    await Well.findByIdAndDelete(id);
    res.status(200).json({ message: "Well deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting well", error });
  }
};

export const getWells = async (req, res) => {
  try {
    const wells = await Well.find();
    res.status(200).json({ wells });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wells", error });
  }
};
