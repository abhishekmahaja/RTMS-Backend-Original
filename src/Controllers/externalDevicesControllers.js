import { broadcast } from "../../index.js";
import ExternalDevice from "../Models/externalDevicesModel.js";
import Well from "../Models/wellMasterModel.js";

//to data store using external device using post
export const externalDataCollect = async (req, res) => {
  try {
    const newData = new ExternalDevice({
      data: req.body,
    });

    await newData.save();

    // Broadcast the saved data to all WebSocket clients
    broadcast({
      status: true,
      message: "New data received",
      data: newData,
    });

    res.status(201).json({
      status: true,
      message: "Data Saved successfully",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error saving data",
    });
  }
};

//show all repeated nodeID and Node Data repeated
// export const externalRepeatedDataShow = async (req, res) => {
//   try {
//     const { organizationName } = req.query;

//     if (!organizationName) {
//       return res.status(400).json({
//         success: false,
//         message: "Organization name is required",
//       });
//     }

//     // Query the database directly with the organization name
//     const newData = await ExternalDevice.find({
//       "data.OrgID": organizationName,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Data retrieved successfully",
//       data: newData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error retrieving data",
//     });
//   }
// };

// to get all data using external decice and show
export const externalDataShow = async (req, res) => {
  try {
    const { organizationName } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    // Step 1: Aggregate data to get unique NodeAdd
    const uniqueNodeData = await ExternalDevice.aggregate([
      { $match: { "data.OrgID": organizationName } },
      { $sort: { createAt: -1 } },
      {
        $group: {
          _id: "$data.NodeAdd",
          latestEntry: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestEntry" },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "NodeID Retrieved successfully",
      data: uniqueNodeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving data",
    });
  }
};

// to get all data using external decice and show with well number and nodeID
export const getNodeAllDataByOrganization = async (req, res) => {
  try {
    const { organizationName } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Name is required",
      });
    }

    // Step 1: Find all wells for the specified organization
    const wells = await Well.find({ organizationName });

    if (!wells || wells.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No wells found for the organization '${organizationName}'`,
      });
    }

    // Step 2: Retrieve node IDs associated with the organization's wells
    const nodeIDs = wells.map((well) => well.nodeID).filter(Boolean);

    // Step 3: Retrieve the latest ExternalDevice entry for each unique NodeAdd
    const nodeDevices = await ExternalDevice.aggregate([
      { $match: { "data.OrgID": organizationName } },
      { $sort: { createAt: -1 } },
      {
        $group: {
          _id: "$data.NodeAdd",
          latestEntry: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestEntry" },
      },
    ]);

    // Step 4: Organize the data based on well numbers and associated node data
    const wellData = wells.map((well) => {
      // Find the device data associated with the well's nodeID
      const deviceData = nodeDevices.find(
        (device) => device.data.NodeAdd === well.nodeID
      );

      if (!deviceData) {
        console.log(
          `No device data found for well ${well.wellNumber} with nodeID ${well.nodeID}`
        );
      }

      return {
        wellNumber: well.wellNumber,
        wellDetails: well,
        nodeData: deviceData || null,
      };
    });

    // Step 5: Respond with the organized well and node data
    res.status(200).json({
      success: true,
      message: "Node data retrieved successfully",
      wellData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving node data",
    });
  }
};

// to get Single data using external decice and show with well number and nodeID
export const getSingleWellNodeDataByOrganization = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.query;

    if (!organizationName || !wellNumber) {
      return res.status(400).json({
        success: false,
        message: "Organization Name and Well Number are required",
      });
    }

    // Step 1: Find the specific well by organization and well number
    const well = await Well.findOne({ organizationName, wellNumber });

    if (!well) {
      return res.status(404).json({
        success: false,
        message: `No well found with well number '${wellNumber}' for the organization '${organizationName}'`,
      });
    }

    // Step 2: Retrieve the latest ExternalDevice entry for the well's nodeID
    const nodeDevice = await ExternalDevice.aggregate([
      {
        $match: { "data.OrgID": organizationName, "data.NodeAdd": well.nodeID },
      },
      { $sort: { createAt: -1 } },
      { $limit: 1 },
      {
        $replaceRoot: { newRoot: "$$ROOT" },
      },
    ]);

    const deviceData = nodeDevice.length > 0 ? nodeDevice[0] : null;

    // Step 3: Organize the well data and associated node data
    const wellData = {
      wellNumber: well.wellNumber,
      wellDetails: well,
      nodeData: deviceData || null,
    };

    // Step 4: Respond with the well and node data
    res.status(200).json({
      success: true,
      message: "Well data with node information retrieved successfully",
      wellData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving well and node data",
    });
  }
};

// Define the function to filter well node data
//with well number
// export const getFilterWellNodeData = async (req, res) => {
//   try {
//     const {
//       organizationName,
//       wellLocation,
//       wellInstallation,
//       wellNumber,
//       parameter
//     } = req.query;

//     // Validate required query parameters
//     if (!organizationName || !wellLocation || !wellInstallation || !wellNumber || !parameter) {
//       return res.status(400).json({
//         success: false,
//         message: "Organization Name, Well Location, Installation, Well Number, and Parameter are required.",
//       });
//     }

//     // Step 1: Find the specific well based on the filters
//     const wellFilter = {
//       organizationName,
//       wellLocation,
//       wellInstallation,
//       wellNumber,
//     };

//     const wells = await Well.find(wellFilter);

//     if (!wells || wells.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No wells found with the specified criteria.",
//       });
//     }

//     // Step 2: Retrieve node IDs associated with the well
//     const nodeIDs = wells.map((well) => well.nodeID).filter(Boolean);

//     // Step 3: Retrieve the latest ExternalDevice entry for each unique NodeAdd
//     const nodeDevices = await ExternalDevice.aggregate([
//       { $match: { "data.OrgID": organizationName } },
//       { $sort: { createdAt: -1 } },
//       {
//         $group: {
//           _id: "$data.NodeAdd",
//           latestEntry: { $first: "$$ROOT" },
//         },
//       },
//       { $replaceRoot: { newRoot: "$latestEntry" } },
//     ]);

//     // Step 4: Filter node data based on the parameter
//     let filteredNodeData;
//     switch (parameter) {
//       case "Battery":
//         filteredNodeData = nodeDevices.filter(device => parseFloat(device.data.Bat) <= 21);
//         break;
//       case "Solar":
//         filteredNodeData = nodeDevices.filter(device => parseFloat(device.data.Solar) < 15);
//         break;
//       case "Network Error":
//         filteredNodeData = nodeDevices.filter(device => !device.data);
//         break;
//       case "Flowing":
//         filteredNodeData = wells.filter(well => well.flowing === true)
//           .map(well => nodeDevices.find(device => device.data.NodeAdd === well.nodeID));
//         break;
//       case "Not Flowing":
//         filteredNodeData = wells.filter(well => well.flowing === false)
//           .map(well => nodeDevices.find(device => device.data.NodeAdd === well.nodeID));
//         break;
//       case "All":
//       default:
//         filteredNodeData = nodeDevices;
//         break;
//     }

//     // Step 5: Map wells to filtered node data
//     const wellData = wells.map((well) => {
//       const deviceData = filteredNodeData.find(device => device?.data?.NodeAdd === well.nodeID);
//       return {
//         wellNumber: well.wellNumber,
//         wellDetails: well,
//         nodeData: deviceData || null,
//       };
//     }).filter(entry => entry.nodeData);

//     // Step 6: Respond with organized well and node data
//     res.status(200).json({
//       success: true,
//       message: "Filtered node data retrieved successfully",
//       wellData,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error retrieving node data",
//     });
//   }
// };

//without well number to check
export const getFilterWellNodeData = async (req, res) => {
  try {
    const { organizationName, wellLocation, wellInstallation, parameter } =
      req.query;

    // Validate required query parameters
    if (!organizationName || !wellLocation || !wellInstallation || !parameter) {
      return res.status(400).json({
        success: false,
        message:
          "Organization Name, Well Location, Installation, and Parameter are required.",
      });
    }

    // Step 1: Find wells based on organization, location, and installation
    const wellFilter = {
      organizationName,
      wellLocation,
      wellInstallation,
    };

    const wells = await Well.find(wellFilter);

    if (!wells || wells.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No wells found with the specified criteria.",
      });
    }

    // Step 2: Retrieve node IDs associated with the filtered wells
    const nodeIDs = wells.map((well) => well.nodeID).filter(Boolean);

    // Step 3: Retrieve the latest ExternalDevice entry for each unique NodeAdd
    const nodeDevices = await ExternalDevice.aggregate([
      { $match: { "data.OrgID": organizationName } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$data.NodeAdd",
          latestEntry: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestEntry" } },
    ]);

    // Step 4: Apply parameter-based filtering on the node data
    let filteredNodeData;
    switch (parameter) {
      case "Battery":
        filteredNodeData = nodeDevices.filter(
          (device) => parseFloat(device.data.Bat) < 20
        );
        break;
      case "Solar":
        filteredNodeData = nodeDevices.filter(
          (device) => parseFloat(device.data.Solar) < 15
        );
        break;
      case "Network Error":
        filteredNodeData = nodeDevices.filter((device) => !device.data);
        break;
      case "Flowing":
        filteredNodeData = wells
          .filter((well) => well.flowing === true)
          .map((well) =>
            nodeDevices.find((device) => device.data.NodeAdd === well.nodeID)
          );
        break;
      case "Not Flowing":
        filteredNodeData = wells
          .filter((well) => well.flowing === false)
          .map((well) =>
            nodeDevices.find((device) => device.data.NodeAdd === well.nodeID)
          );
        break;
      case "All":
      default:
        filteredNodeData = nodeDevices;
        break;
    }

    // Step 5: Map filtered node data to the wells
    const wellData = wells
      .map((well) => {
        const deviceData = filteredNodeData.find(
          (device) => device?.data?.NodeAdd === well.nodeID
        );
        return {
          wellNumber: well.wellNumber,
          wellDetails: well,
          nodeData: deviceData || null,
        };
      })
      .filter((entry) => entry.nodeData); // Remove entries without matching node data

    // Step 6: Respond with the organized well and node data
    res.status(200).json({
      success: true,
      message: "Filtered node data retrieved successfully",
      wellData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving node data",
    });
  }
};
