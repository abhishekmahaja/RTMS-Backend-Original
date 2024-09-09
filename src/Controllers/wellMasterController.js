import Well from "../Models/wellMasterModel.js";
import { sendWellNotificationToOwner } from "../Helpers/helper.js";

// Add a new well
export const addWell = async (req, res) => {
  try {
    const newWell = new Well(req.body);
    await newWell.save();
    res.status(201).json({
      success: true,
      message: "Well added successfully and Now Wait for Approval",
      well: newWell,
    });

    //notification send to Owner
    await sendWellNotificationToOwner(
      process.env.OWNER_MAIL,
      "Add Well Now wait for approval ",
      `<p>Add Well And Now Wait For Approval and well number ${newWell.wellNumber}</p>`
    );

    //notification send to Manager
    await sendWellNotificationToOwner(
      process.env.MANAGER_MAIL,
      "Add Well Now wait for approval ",
      `<p>Add Well And Now Wait For Approval and well number ${newWell.wellNumber}</p>`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error adding well",
    });
  }
};

//Add Well is approved by Manager
export const wellApprovedByManager = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedManager = await Well.findById(id);

    if (!approvedManager) {
      return res.status(404).json({
        success: false,
        message: "Well not found",
      });
    }
    if (approvedManager.isApprovedByManager) {
      return res.json({
        success: false,
        message: "This Well is Already Approved By Manager",
      });
    }

    approvedManager.isApprovedByManager = true;
    await approvedManager.save();
    res.status(200).json({
      success: true,
      message: "Well Approved By Manager Now Wait For Owner Approval",
    });

    //notification send to Owner
    await sendWellNotificationToOwner(
      process.env.OWNER_MAIL,
      "Wait for approval ",
      `<p>Now Wait For Approval and well number ${approvedManager.wellNumber}</p>`
    );

    //notification send to Manager
    await sendWellNotificationToOwner(
      process.env.MANAGER_MAIL,
      "Wait for approval ",
      `<p>Now Wait For Approval and well number ${approvedManager.wellNumber}</p>`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Adding Well Approval By Manager",
    });
  }
};

//Add Well is approved by owner
export const wellApprovedByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedOwner = await Well.findById(id);

    if (!approvedOwner) {
      return res.status(404).json({
        success: false,
        message: "Well not found",
      });
    }
    if (approvedOwner.isApprovedByOwner) {
      return res.json({
        success: false,
        message: "This Well is Already Approved By Owner",
      });
    }

    approvedOwner.isApprovedByOwner = true;

    if (!approvedOwner.isApprovedByManager) {
      approvedOwner.isApprovedByManager = true;
      await approvedOwner.save();
      res.status(200).json({
        success: true,
        message:
          "This Well Directly Approved By Owner No Need to Manager Approval",
      });
    }

    await approvedOwner.save();

    res.status(200).json({
      success: true,
      message: "Well Approved By Owner.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Adding Well Approval By Manager",
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

    updatedWell.isApprovedByOwner= false;
    updatedWell.isApprovedByManager = false;
    updatedWell.save();

    res.status(200).json({
      success: true,
      message: "Well updated successfully and Now Wait For Approval",
      well: updatedWell,
    });

    //notification send to Owner
    await sendWellNotificationToOwner(
      process.env.OWNER_MAIL,
      "Update Well Now wait for approval ",
      `<p>Update Well And Now Wait For Approval and well number ${updatedWell.wellNumber}</p>`
    );

    //notification send to Manager
    await sendWellNotificationToOwner(
      process.env.MANAGER_MAIL,
      "Update Well Now wait for approval ",
      `<p>Update Well And Now Wait For Approval and well number ${updatedWell.wellNumber}</p>`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating well",
    });
  }
};

//Well approval Data Show
export const getNotApprovalWells = async (req, res) => {
  try {
    // Find wells where either manager or owner has not approved
    const approvalWells = await Well.find({
      $or: [
        { isApprovedByManager: false },  // Not approved by manager
        { isApprovedByOwner: false }     // Not approved by owner
      ]
    });

    res.status(200).json({
      success: true,
      message: "Unapproved Wells Fetched Successfully",
      approvalWells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Unapproved Wells",
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
      message: "Well deleted successfully And Now Wait For Approval",
    });

    ///notification send to Owner
    await sendWellNotificationToOwner(
      process.env.OWNER_MAIL,
      "Delete Well Now wait for approval ",
      `<p>Delete Well And Now Wait For Approval and well number ${deletedWell.wellNumber}</p>`
    );
    ///notification send to Manager
    await sendWellNotificationToOwner(
      process.env.MANAGER_MAIL,
      "Delete Well Now wait for approval ",
      `<p>Delete Well And Now Wait For Approval and well number ${deletedWell.wellNumber}</p>`
    );
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
    const wells = await Well.find({
      $or: [
        { isApprovedByManager: true },  // Not approved by manager
        { isApprovedByOwner: true }     // Not approved by owner
      ]
    });
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
