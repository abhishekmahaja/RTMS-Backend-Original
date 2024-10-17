import Well from "../Models/wellMasterModel.js";
import { sendWellNotificationToOwner } from "../Helpers/helper.js";
import Organization from "../Models/organizationModel.js";

// Add Location with Latitude/Longitude
export const addWellLocation = async (req, res) => {
  try {
    const { organizationName, wellLocation } = req.body;

    if (!organizationName || !wellLocation) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Location are required",
      });
    }

    // Find the organization by name
    const organization = await Organization.findOne({ organizationName });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Find the well associated with this organization
    let well = await Well.findOne({ organizationName });

    if (!well) {
      // If no well exists for this organization, create a new one
      well = new Well({
        organizationName,
        wellLocations: [
          {
            wellLocation,
          },
        ],
      });

      await well.save();

      return res.status(201).json({
        success: true,
        message: `Well Location ${wellLocation} added successfully`,
        data: well.wellLocations,
      });
    }

    // Check if the Well Location already exists
    const locationExists = well.wellLocations.some(
      (loc) => loc.wellLocation === wellLocation
    );

    if (locationExists) {
      return res.status(400).json({
        success: false,
        message: "Well Location already exists in the organization",
      });
    }

    // Add New Well Location
    well.wellLocations.push({
      wellLocation,
    });

    await well.save();

    return res.status(201).json({
      success: true,
      message: `Well Location ${wellLocation} added successfully`,
      data: well.wellLocations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while adding the Well Location",
    });
  }
};

//Add Installation to the Existing Location
export const addInstallationToLocation = async (req, res) => {
  try {
    const { organizationName, wellLocation, wellInstallations } = req.body;

    if (!organizationName || !wellLocation || !wellInstallations) {
      return res.status(400).json({
        success: false,
        message:
          "Organization Name, Well Location, and wellInstallations details are required",
      });
    }

    // Find the well associated with this organization
    let well = await Well.findOne({ organizationName });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well for organization ${organizationName} not found.`,
      });
    }

    // Find the location within the well's locations
    const location = well.wellLocations.find(
      (loc) => loc.wellLocation === wellLocation
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location ${wellLocation} not found. Please add the location first.`,
      });
    }

    // Check if the installation already exists for the location
    const installationExists =
      location.wellInstallations.includes(wellInstallations);

    if (installationExists) {
      return res.status(400).json({
        success: false,
        message: `Installation ${wellInstallations} already exists for the location ${wellLocation}`,
      });
    }

    // Add the new installation if it doesn't exist
    location.wellInstallations.push(wellInstallations);

    // Save the updated well document
    await well.save();

    return res.status(200).json({
      success: true,
      message: `Installation ${wellInstallations} added successfully to the location ${wellLocation}`,
      data: location,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while adding the installation",
    });
  }
};

//Add Well Type and Number on the  based of location and installation
// export const addWellTypeAndNumber = async (req, res) => {
//   try {
//     const {
//       organizationName,
//       wellLocation,
//       wellInstallation,
//       wellNumber,
//       wellType,
//     } = req.body;

//     // Validate if required fields are provided
//     if (
//       !organizationName ||
//       !wellLocation ||
//       !wellInstallation ||
//       !wellNumber ||
//       !wellType
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Organization Name, Well Location, Well Installation, Well Number, and Well Type are required.",
//       });
//     }

//     // Find the well associated with this organization
//     let well = await Well.findOne({ organizationName });

//     if (!well) {
//       return res.status(404).json({
//         success: false,
//         message: `Well for organization ${organizationName} not found.`,
//       });
//     }

//     // Find the location within the well's locations
//     const location = well.wellLocations.find(
//       (loc) => loc.wellLocation === wellLocation
//     );

//     if (!location) {
//       return res.status(404).json({
//         success: false,
//         message: `Location ${wellLocation} not found. Please add the location first.`,
//       });
//     }

//     // Find the installation within the location
//     const installation = location.wellInstallations.find(
//       (inst) => inst === wellInstallation
//     );

//     if (!installation) {
//       return res.status(404).json({
//         success: false,
//         message: `Installation ${wellInstallation} not found in location ${wellLocation}. Please add the installation first.`,
//       });
//     }

//     // Check if the well number is the same (since it's now a single string)
//     if (location.wellNumber === wellNumber) {
//       return res.status(400).json({
//         success: false,
//         message: `Well Number ${wellNumber} already exists for the Installation ${wellInstallation}`,
//       });
//     }

//     location.wellNumber = wellNumber; // Update the well number

//     // Check if the well type is the same (since it's now a single string)
//     if (location.wellTypes === wellType) {
//       return res.status(400).json({
//         success: false,
//         message: `Well Type ${wellType} already exists for the Installation ${wellInstallation}`,
//       });
//     }

//     location.wellTypes = wellType; // Update the well type

//     // Save the updated well document
//     await well.save();

//     return res.status(200).json({
//       success: true,
//       message: `Well Number and Well Type Added successfully for installation ${wellInstallation} in location ${wellLocation}.`,
//       data: location,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "An error occurred while updating the well installation.",
//     });
//   }
// };

export const addWellTypeAndNumber = async (req, res) => {
  try {
    const {
      organizationName,
      wellLocation,
      wellInstallation,
      wellNumber,
      wellType,
    } = req.body;

    // Validate if required fields are provided
    if (
      !organizationName ||
      !wellLocation ||
      !wellInstallation ||
      !wellNumber ||
      !wellType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Organization Name, Well Location, Well Installation, Well Number, and Well Type are required.",
      });
    }

    // Find the well associated with this organization
    let well = await Well.findOne({ organizationName });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well for organization ${organizationName} not found.`,
      });
    }

    // Find the location within the well's locations
    const location = well.wellLocations.find(
      (loc) => loc.wellLocation === wellLocation
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location ${wellLocation} not found. Please add the location first.`,
      });
    }

    // Find the installation within the location
    const installation = location.wellInstallations.find(
      (inst) => inst.installationName === wellInstallation
    );

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: `Installation ${wellInstallation} not found in location ${wellLocation}. Please add the installation first.`,
      });
    }

    // Check if the well number already exists for this installation
    const wellNumberExists = installation.wellNumber.includes(wellNumber);
    if (wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number ${wellNumber} already exists for the installation ${wellInstallation} in location ${wellLocation}.`,
      });
    }

    // Check if the wellType already exists for this specific installation
    if (installation.wellTypes.includes(wellType)) {
      return res.status(400).json({
        success: false,
        message: `Well Type ${wellType} already exists for the installation ${wellInstallation} in location ${wellLocation}.`,
      });
    }

    // Add the wellNumber and wellType
    installation.wellNumber.push(wellNumber); // Add the new well number
    installation.wellTypes.push(wellType); // Add the new well type

    // Save the updated well document
    await well.save();

    return res.status(200).json({
      success: true,
      message: `Well Number and Well Type added successfully for installation ${wellInstallation} in location ${wellLocation}.`,
      data: location,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the well installation.",
    });
  }
};

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
      "Add Well Now wait for approval",
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
      message: error.message || "Error Adding Well Approval By Owner",
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

    updatedWell.isApprovedByOwner = false;
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
        { isApprovedByManager: false }, // Not approved by manager
        { isApprovedByOwner: false }, // Not approved by owner
      ],
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
      $and: [
        { isApprovedByManager: true }, // Not approved by manager
        { isApprovedByOwner: true }, // Not approved by owner
      ],
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
