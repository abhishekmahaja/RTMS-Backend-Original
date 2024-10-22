import { sendWellNotificationToOwner } from "../Helpers/helper.js";
import Organization from "../Models/organizationModel.js";
import Well from "../Models/wellMasterModel.js";
import Location from "../Models/LocationWellModel.js";
import Installation from "../Models/InstallationWellModel.js";

// Add Location Based on Organization
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

    // Find the Location associated with this organization
    let locationExists = await Location.findOne({ wellLocation });

    if (locationExists) {
      return res.status(400).json({
        success: false,
        message: `Well Location '${wellLocation}' already exists in the organization '${organizationName}'`,
      });
    }

    // CREATING WELL LOCATION
    const newLocation = await Location.create({
      organizationName,
      wellLocation,
    });

    return res.status(201).json({
      success: true,
      message: `Well Location '${wellLocation}' added successfully for organization '${organizationName}'`,
      data: newLocation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the Well Location",
      error: error.message,
    });
  }
};

//GET ALL Location based on Organization
export const getWellLocation = async (req, res) => {
  try {
    const { organizationName } = req.query;

    // Validate organizationName query
    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Name is required.",
      });
    }

    // Find the well Location data for the organization
    const allLocations = await Location.find({ organizationName });

    if (!allLocations) {
      return res.status(404).json({
        success: false,
        message: `No Location found for organization '${organizationName}'.`,
      });
    }

    // Return all well locations
    return res.status(200).json({
      success: true,
      message: `Well locations for organization '${organizationName}' fetched successfully.`,
      data: allLocations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching well locations.",
    });
  }
};

//Add Installation to the Existing Location
export const addInstallationToLocation = async (req, res) => {
  try {
    const { organizationName, wellLocation, wellInstallation } = req.body;

    if (!organizationName || !wellLocation || !wellInstallation) {
      return res.status(400).json({
        success: false,
        message:
          "Organization Name, Well Location, and Well Installations details are required",
      });
    }

    // Find the organization by name
    const organization = await Location.findOne({ organizationName });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Find the location within the well's locations
    let location = await Location.findOne({ wellLocation });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location '${wellLocation}' not found. Please add the location first.`,
      });
    }

    // Find the Installtion associated with this Location
    let installationExists = await Installation.findOne({ wellInstallation });

    if (installationExists) {
      return res.status(400).json({
        success: false,
        message: `Well Location '${wellInstallation}' already exists in the well Location '${wellLocation}'`,
      });
    }

    //Creating Well Installation
    const newInstallation = await Installation.create({
      organizationName,
      wellLocation,
      wellInstallation,
    });

    return res.status(200).json({
      success: true,
      message: `Installation '${wellInstallation}' added successfully to the location '${wellLocation}'`,
      data: newInstallation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while adding the installation",
    });
  }
};

//GET ALL Installation to the Existing Location
export const getInstallationsByLocation = async (req, res) => {
  try {
    const { organizationName, wellLocation } = req.query;

    // Validate required queries
    if (!organizationName || !wellLocation) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Location are required.",
      });
    }

    // Find the all Installation associated with this Location
    const allInstallations = await Installation.find({ wellLocation });

    if (!allInstallations) {
      return res.status(404).json({
        success: false,
        message: `Well Locations for organization '${wellLocation}' not found.`,
      });
    }

    // Return the installations for the well location
    return res.status(200).json({
      success: true,
      message: `All Installations for location '${wellLocation}' in organization '${organizationName}' fetched successfully.`,
      data: allInstallations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching installations.",
    });
  }
};

//Add Well Type and Well number based on Installation, Location, Organization
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

    // Find the location within the well's locations
    const locationExists = Location.find({ wellLocation });

    if (!locationExists) {
      return res.status(404).json({
        success: false,
        message: `Location '${wellLocation}' not found. Please add the location first.`,
      });
    }

    // Find the installation within the location
    const installationExists = Installation.find({ wellInstallation });

    if (!installationExists) {
      return res.status(404).json({
        success: false,
        message: `Installation '${wellInstallation}' not found in location '${wellLocation}'. Please add the installation first.`,
      });
    }

    // Check if the well number already exists for this installation
    const wellNumberExists = await Well.findOne({ wellNumber });

    if (wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number '${wellNumber}' already exists for the installation '${wellInstallation}' in location '${wellLocation}'.`,
      });
    }

    // Create the wellNumber and wellType to the installation
    const newWelLNumberAndWellType = await Well.create({
      organizationName,
      wellLocation,
      wellInstallation,
      wellType,
      wellNumber,
    });

    return res.status(200).json({
      success: true,
      message: `Well Number '${wellNumber}' and Well Type '${wellType}' added successfully to installation '${wellInstallation}' in location '${wellLocation}'.`,
      data: newWelLNumberAndWellType,
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

//GET ALL Well Type and Well number based on Organization
export const getAllWellTypesAndNumber = async (req, res) => {
  try {
    const { organizationName } = req.query;

    // Validate required query parameters
    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Name is required.",
      });
    }

    // Find all wells for the given organization
    const allWells = await Well.find({ organizationName });

    // Check if any wells exist
    if (!allWells || allWells.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No wells found for the organization '${organizationName}'.`,
      });
    }

    // Return the well numbers and well types
    return res.status(200).json({
      success: true,
      message: `Well Number and Well Type fetched successfully for organization '${organizationName}'.`,
      data: allWells,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching the well data.",
    });
  }
};

//GET One Well Type and Well number based on Well number
export const getOneWellByWellNumber = async (req, res) => {
  try {
    const { wellNumber } = req.query;

    // Validate required query parameters
    if (!wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Well Number is required.",
      });
    }

    // Find the well by wellNumber
    const well = await Well.findOne({ wellNumber });

    // Check if the well exists
    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found.`,
      });
    }

    // Return the well data
    return res.status(200).json({
      success: true,
      message: `Well with number '${wellNumber}' fetched successfully.`,
      data: well,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching the well data.",
    });
  }
};

// Add a new well // Update a well by ID
export const addWell = async (req, res) => {
  try {
    const {
      organizationName,
      wellNumber,
      wellLandmarks,
      wellLatitude,
      wellLongitude,
      wellDescription,
      alertSettings,
      flowing,
      notFlowing,
    } = req.body;

    if (
      !organizationName ||
      !wellNumber ||
      !wellLandmarks ||
      !wellLatitude ||
      !wellLongitude ||
      !wellDescription ||
      !alertSettings ||
      !flowing ||
      !notFlowing
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fileds are required",
      });
    }

    // Find the organization by name
    const organizationExists = await Organization.findOne({ organizationName });

    if (!organizationExists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Check if the well number already exists for this installation
    const wellNumberExists = await Well.findOne({ wellNumber });

    if (!wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number '${wellNumber}' not found`,
      });
    }

    //check all the value whose enter
    wellNumberExists.wellLatitude = wellLandmarks;
    wellNumberExists.wellDescription = wellLatitude;
    wellNumberExists.wellLongitude = wellLongitude;
    wellNumberExists.wellDescription = wellDescription;
    // Update alertSettings
    wellNumberExists.alertSettings = alertSettings;
    // Update flowing and notFlowing
    wellNumberExists.flowing = flowing;
    wellNumberExists.notFlowing = notFlowing;

    // Save updated well details
    await wellNumberExists.save();

    res.status(201).json({
      success: true,
      message: "Well added successfully and Now Wait for Approval",
      well: wellNumberExists,
    });

    //notification send to Owner
    await sendWellNotificationToOwner(
      process.env.OWNER_MAIL,
      "Add Well Now wait for approval ",
      `<p>Add Well And Now Wait For Approval and well number ${wellNumberExists}</p>`
    );

    //notification send to Manager
    await sendWellNotificationToOwner(
      process.env.MANAGER_MAIL,
      "Add Well Now wait for approval",
      `<p>Add Well And Now Wait For Approval and well number ${wellNumberExists}</p>`
    );
  } catch (error) {
    console.log(error);
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

// Find wells where either manager or owner has not approved
export const getNotApprovalWells = async (req, res) => {
  try {
    const approvalWells = await Well.find({
      $or: [{ isApprovedByManager: false }, { isApprovedByOwner: false }],
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
