import ExternalDevice from "../Models/externalDevicesModel.js";
import Well from "../Models/wellMasterModel.js";

//to data store using external device using post
export const externalDataCollect = async (req, res) => {
  try {
    const newData = new ExternalDevice({
      data: req.body,
    });

    await newData.save();

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
export const externalDataWellAndNodeIDShow = async (req, res) => {
  try {
    const { organizationName, wellNumber } = req.query;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization Name is required",
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
    const wellExists = await Well.findOne({ wellNumber });

    if (!wellExists) {
      return res.status(404).json({
        success: false,
        message: `Well with number '${wellNumber}' not found.`,
      });
    }

    // Find the node by data (Node ID)
    const nodeExists = await ExternalDevice.findOne({ data });

    if (!nodeExists) {
      return res.status(404).json({
        success: false,
        message: `Node ID '${data}' not found.`,
      });
    }

    //latest data in ExternalDevice sorted by time (assuming you have a `timestamp` field)
    const latestData = await ExternalDevice.find({ wellNumber, data })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(1); // Get the latest entry

    res.status(200).json({
      success: true,
      message: `Data Show Successfully With Connected Node ID '${data}' with Well Number '${wellNumber}'`,
      data: latestData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving data",
    });
  }
};
