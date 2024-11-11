import {
  sendWellDeleteNotificationToManager,
  sendWellDeleteNotificationToOwner,
  sendWellNotificationToManager,
  sendWellNotificationToOwner,
  sendWellRejectNotificationToManager,
  sendWellRejectNotificationToOwner,
} from "../Helpers/helper.js";
import Organization from "../Models/organizationModel.js";
import Well from "../Models/wellMasterModel.js";
import Location from "../Models/LocationWellModel.js";
import Installation from "../Models/InstallationWellModel.js";
import Users from "../Models/userModel.js";

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

// Update Location Based on Organization
export const updateWellLocation = async (req, res) => {
  try {
    const { organizationName, oldWellLocation, newWellLocation } = req.body;

    if (!organizationName || !oldWellLocation || !newWellLocation) {
      return res.status(400).json({
        success: false,
        message:
          "Organization Name, Old Well Location, and New Well Location are required",
      });
    }

    // Update all matching entries in the Location model
    const locationUpdateResult = await Location.updateMany(
      { organizationName, wellLocation: oldWellLocation },
      { wellLocation: newWellLocation }
    );

    // Update all matching entries in the Installation model
    const installationUpdateResult = await Installation.updateMany(
      { organizationName, wellLocation: oldWellLocation },
      { wellLocation: newWellLocation }
    );

    // Update all matching entries in the Well model
    const wellUpdateResult = await Well.updateMany(
      { organizationName, wellLocation: oldWellLocation },
      { wellLocation: newWellLocation }
    );

    // Check if any updates were made in at least one collection
    if (
      locationUpdateResult.matchedCount === 0 &&
      installationUpdateResult.matchedCount === 0 &&
      wellUpdateResult.matchedCount === 0
    ) {
      return res.status(404).json({
        success: false,
        message: `No entries found for Organization '${organizationName}' with Location '${oldWellLocation}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Location updated successfully from '${oldWellLocation}' to '${newWellLocation}' in all relevant collections.`,
      Location: locationUpdateResult,
      Installation: installationUpdateResult,
      Well: wellUpdateResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the Well Location",
      error: error.message,
    });
  }
};

// Delete Location Based on Organization and Well Location
export const deleteWellLocation = async (req, res) => {
  try {
    const { organizationName, wellLocation } = req.body;

    if (!organizationName || !wellLocation) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Location are required",
      });
    }

    // Delete all matching entries in the Location model
    const locationDeleteResult = await Location.deleteMany({
      organizationName,
      wellLocation,
    });

    // Delete all matching entries in the Installation model
    const installationDeleteResult = await Installation.deleteMany({
      organizationName,
      wellLocation,
    });

    // Delete all matching entries in the Well model
    const wellDeleteResult = await Well.deleteMany({
      organizationName,
      wellLocation,
    });

    // Check if any deletions were made in at least one collection
    if (
      locationDeleteResult.deletedCount === 0 &&
      installationDeleteResult.deletedCount === 0 &&
      wellDeleteResult.deletedCount === 0
    ) {
      return res.status(404).json({
        success: false,
        message: `No entries found for Organization '${organizationName}' with Location '${wellLocation}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Location '${wellLocation}' deleted successfully for Organization '${organizationName}' in all relevant collections.`,
      Location: locationDeleteResult,
      Installation: installationDeleteResult,
      Well: wellDeleteResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the Well Location",
      error: error.message,
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

    // // Find the Installtion associated with this Location
    let installationExists = await Installation.findOne({
      wellLocation,
      wellInstallation,
    });

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
    const locationExists = await Location.findOne({ wellLocation });

    if (!locationExists) {
      return res.status(404).json({
        success: false,
        message: `Location '${wellLocation}' not found. Please add the location first.`,
      });
    }

    // Find the installation within the location
    const installationExists = await Installation.findOne({
      wellLocation,
      wellInstallation,
    });

    if (!installationExists) {
      return res.status(404).json({
        success: false,
        message: `Installation '${wellInstallation}' not found in location '${wellLocation}'. Please add the installation first.`,
      });
    }

    // Check if the well number already exists for this installation
    const wellNumberExists = await Well.findOne({ wellNumber, wellLocation });

    if (wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number '${wellNumber}' already exists for the installation '${wellInstallation}' in location '${wellLocation}'.`,
      });
    }

    // Create the wellNumber and wellType for the installation
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the well installation.",
    });
  }
};

//GET ALL Well Type and number based Organization (Not Approved, Aproved owner or manager)
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

//GET One Well based on Well number (Not Approved, Aproved owner or manager)
export const getOneWellByWellNumber = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.query;

    // Validate required query parameters
    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "organization Name and Well Number is required.",
      });
    }

    // Find the organization by name
    const organizationExists = await Well.findOne({ organizationName });

    if (!organizationExists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
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
      message: `Well with number '${wellNumber}' in Organization Name '${organizationName}' fetched successfully.`,
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
export const addAndUpdateWell = async (req, res) => {
  try {
    const {
      organizationName,
      wellNumber,
      wellLandmarks,
      wellLatitude,
      wellLongitude,
      nodeID,
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
      !nodeID ||
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

    const isNodIdExists = await Well.findOne({ nodeID });

    if (isNodIdExists) {
      return res.status(400).json({
        success: false,
        message: `Node ID '${nodeID}' is already present!`,
      });
    }

    //check all the value whose enter
    wellNumberExists.wellLandmarks = wellLandmarks;
    wellNumberExists.nodeID = nodeID;
    wellNumberExists.wellLatitude = wellLatitude;
    wellNumberExists.wellLongitude = wellLongitude;
    wellNumberExists.nodeID = nodeID;
    // Update alertSettings
    wellNumberExists.alertSettings = alertSettings;
    // Update flowing and notFlowing
    wellNumberExists.flowing = flowing;
    wellNumberExists.notFlowing = notFlowing;

    // Find the owner of the organization
    const owner = await Users.findOne({
      organizationName,
      roleInRTMS: "owner",
    });

    // Find the manager of the organization
    const manager = await Users.findOne({
      organizationName,
      roleInRTMS: "manager",
    });

    if (!manager || !owner) {
      return res.status(404).json({
        success: false,
        message: "No manager or owner found for this organization",
      });
    }

    //notification send to Owner
    await sendWellNotificationToOwner(wellNumberExists, owner.email);

    //notification send to Manager
    await sendWellNotificationToManager(wellNumberExists, manager.email);

    console.log("owner", owner.email);
    console.log("manager", manager.email);

    // Save updated well details
    await wellNumberExists.save();

    res.status(201).json({
      success: true,
      message: "Well added successfully and Now Wait for Approval",
      data: wellNumberExists,
    });
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
    const { wellNumber } = req.body;

    if (!wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Well Number is Required",
      });
    }

    console.log("well", wellNumber);

    // Find Well by wellNumber
    const well = await Well.findOne({ wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: "Well Not Found",
      });
    }

    // Check if Well is already approved by Manager
    if (well.isApprovedByManager) {
      return res.status(400).json({
        success: false,
        message: "This Well is Already Approved By Manager",
      });
    }

    // Find the owner of the Organization
    const owner = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "owner",
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "No Owner Found for this Organization",
      });
    }

    // Send notification to the owner for further approval
    await sendWellNotificationToOwner(owner.email, well);

    // Mark the Well as approved by manager
    well.isApprovedByManager = true;
    await well.save();

    res.status(200).json({
      success: true,
      message: `Well '${wellNumber}' Approved by Manager. Waiting For Owner Approval.`,
    });
  } catch (error) {
    console.error("Error approving well by manager:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error Adding Well Approval By Manager",
    });
  }
};

//Add Well is approved by owner
export const wellApprovedByOwner = async (req, res) => {
  try {
    const { wellNumber } = req.body;

    if (!wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Well Number is Required",
      });
    }

    // Find Well by wellNumber
    const well = await Well.findOne({ wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: "Well Not Found",
      });
    }

    // Check if Well is already approved by Manager
    if (well.isApprovedByOwner) {
      return res.status(400).json({
        success: false,
        message: "This Well is Already Approved By Owner",
      });
    }

    // Find the manager of the Organization
    const manager = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "manager",
    });

    console.log("owner api ", well.organizationName);

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "No Manager Found for this Organization",
      });
    }

    // Set well approval status
    well.isApprovedByOwner = true;
    well.isApprovedByManager = true;
    await well.save();

    // Check if well is also approved by owner
    if (well.isApprovedByOwner) {
      await sendWellNotificationToManager(manager.email, well);
    }

    res.status(200).json({
      success: true,
      message: `Well '${wellNumber}' Approved by Owner.`,
    });
  } catch (error) {
    console.error("Error approving well by Owner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error Adding Well Approval By Owner",
    });
  }
};

// Find wells where either manager or owner has not approved
export const getNotApprovalOwnerWells = async (req, res) => {
  try {
    const { organizationName } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Name is Required",
      });
    }

    // Find Wells where either manager or owner has not approved, based on the organization name
    const approvalOwnerWells = await Well.find({
      organizationName: organizationName,
      $or: [{ isApprovedByManager: false }, { isApprovedByOwner: false }],
    });

    res.status(200).json({
      success: true,
      message: "Unapproved Wells Fetched Successfully",
      data: approvalOwnerWells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Unapproved Wells",
    });
  }
};

//Find Wells not approved by Manager
export const getNotApprovalManagerWells = async (req, res) => {
  try {
    const { organizationName } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Not Found",
      });
    }

    // Find Wells where the manager has not approved, based on the organization name
    const approvedManagerWells = await Well.find({
      organizationName: organizationName,
      isApprovedByManager: false,
    });

    res.status(200).json({
      success: true,
      message: "Unapproved Wells Fetched Successfully",
      data: approvedManagerWells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fteching Unapproved Wells By Manager",
    });
  }
};

// Get all wells (if all approved by owner and manager) based on Organization Name
export const getAllWellsApprovedBoth = async (req, res) => {
  try {
    const { organizationName } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    // Find the well Organization data
    const allWells = await Well.find({ organizationName });

    if (!allWells) {
      return res.status(404).json({
        success: false,
        message: `No Wells found for organization '${organizationName}'.`,
      });
    }

    const wells = await Well.find({
      $and: [{ isApprovedByManager: true }, { isApprovedByOwner: true }],
    });

    res.status(200).json({
      success: true,
      message: `All Well found successfully for the Organization '${organizationName}'`,
      data: wells,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching wells",
    });
  }
};

// Get Single wells based on Well Number (if all approved by owner and manager)
export const getSingleWellApprovedBoth = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.query;

    // Check if required parameters are provided
    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Organization name and well number are required",
      });
    }

    // Find the well by organizationName and wellNumber
    const well = await Well.findOne({ organizationName, wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found in organization '${organizationName}'.`,
      });
    }

    // Check if both manager and owner have approved the well
    if (!well.isApprovedByManager || !well.isApprovedByOwner) {
      return res.status(200).json({
        success: false,
        message: `Well '${wellNumber}' is not approved by ${
          !well.isApprovedByManager ? "manager" : ""
        }${
          !well.isApprovedByManager && !well.isApprovedByOwner ? " and " : ""
        }${!well.isApprovedByOwner ? "owner" : ""}.`,
      });
    }

    // If approved by both manager and owner, return the well details
    return res.status(200).json({
      success: true,
      message: `Well '${wellNumber}' found and approved by both manager and owner in organization '${organizationName}'.`,
      data: well,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching well details",
    });
  }
};

// Reject Well by manager
export const rejectWellByManager = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.body;

    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Number are Required",
      });
    }

    // Find the well by organizationName and wellNumber
    const well = await Well.findOne({ organizationName, wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found in organization '${organizationName}'.`,
      });
    }

    // Find the owner of the organization
    const owner = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "owner",
    });

    // Check if an owner is found
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "No Owner found for this Organization",
      });
    }

    //Delete the Well Record from the database
    const wellNumberExists = await Well.deleteOne({ wellNumber });

    if (!wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number '${wellNumber}' not found`,
      });
    }

    //Send Notification to Owner
    await sendWellRejectNotificationToOwner(wellNumberExists, owner.email);

    res.status(200).json({
      success: true,
      message: "Well Reject by Manager and Notification Send to owner",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject Well by manager",
    });
  }
};

// Reject Well by Owner
export const rejectWellByOwner = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.body;

    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Number are Required",
      });
    }

    // Find the well by organizationName and wellNumber
    const well = await Well.findOne({ organizationName, wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found in organization '${organizationName}'.`,
      });
    }

    // Find the manager of the organization
    const manager = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "manager",
    });

    // Check if an manager is found
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "No manager found for this Organization",
      });
    }

    if (!manager.email) {
      return res.status(400).json({
        success: false,
        message: "Manager does not have a valid email",
      });
    }

    //Delete the Well Record from the database
    const wellNumberExists = await Well.deleteOne({ wellNumber });

    if (!wellNumberExists) {
      return res.status(400).json({
        success: false,
        message: `Well Number '${wellNumber}' not found`,
      });
    }

    //Send Notification to Owner
    await sendWellRejectNotificationToManager(wellNumberExists, manager.email);

    res.status(200).json({
      success: true,
      message: "Well Reject by Owner and Notification Send to Manager",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject Well by Owner",
    });
  }
};

// Delete well by well Number based on Organization
export const deleteWellByNumber = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.query;

    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Number are Required",
      });
    }

    // Find the well by organizationName and wellNumber
    const well = await Well.findOne({ organizationName, wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found in organization '${organizationName}'.`,
      });
    }

    // Delete the well by organizationName and wellNumber
    const deletedWell = await Well.findOneAndDelete({
      organizationName,
      wellNumber,
    });

    if (!deletedWell) {
      return res.status(404).json({
        success: false,
        message: "Well not found for deletion",
      });
    }

    // Find the manager of the organization
    const manager = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "manager",
    });

    // Find the owner of the organization
    const owner = await Users.findOne({
      organizationName: well.organizationName,
      roleInRTMS: "owner",
    });

    // Check if an owner and manager are found
    if (!owner || !manager) {
      return res.status(404).json({
        success: false,
        message: "No Owner and Manager found for this Organization",
      });
    }

    // Check if the owner and manager have valid emails
    if (!owner.email || !manager.email) {
      return res.status(400).json({
        success: false,
        message: "Owner or Manager does not have a valid email",
      });
    }

    // Send notifications to the Owner and Manager
    await sendWellDeleteNotificationToOwner(well, owner.email);
    await sendWellDeleteNotificationToManager(well, manager.email);

    // Respond with success
    res.status(200).json({
      success: true,
      message:
        "Well deleted successfully and notifications sent to Owner and Manager",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting well",
    });
  }
};
