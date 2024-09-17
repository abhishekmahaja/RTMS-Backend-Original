import Organization from "../Models/organizationModel.js";

// organization Add Data APi
export const organizationAddData = async (req, res) => {
  try {
    const organizationAdd = await Organization.create(req.body);
    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationAdd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};

// Organization Update Data API
export const organizationUpdateData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Enter The Id of Organization",
      });
    }

    const organizationUpdate = await Organization.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organizationUpdate) {
      return res.status(404).json({
        success: false,
        message: "Organization Not Found",
      });
    }

    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};

// Organization Get Data API
export const organizationGetOneData = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationUpdate = await Organization.findById(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organizationUpdate) {
      return res.status(404).json({
        success: false,
        message: "Organization Not Found",
      });
    }

    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};
