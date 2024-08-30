import externalDevice from "../Models/externalDevicesModel.js";

//to data store using external device using post
// export const externalDataCollect = async (req, res) => {
//   try {
//     const newData = new externalDevice(req.body);
//     await newData.save();
//     res.status(201).json({
//       status: true,
//       message: "Data saved successfully",
//       data: newData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error saving data",
//     });
//   }
// };

export const externalDataCollect = async (req, res) => {
  try {
    const { GIP, CHP, THP, Battery_Percentage, Solar_Power, Communication } = req.body;
    const newData = new externalDevice({
      data: {
        GIP,
        CHP,
        THP,
        Battery_Percentage,
        Solar_Power,
        Communication,
      },
    });
    await newData.save();
    res.status(201).json({
      status: true,
      message: "Data saved successfully",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error saving data",
    });
  }
};

// to get all data using external decice and show
export const externalDataShow = async (req, res) => {
  try {
    const allData = await externalDevice.find();
    res.status(200).json({
      success: true,
      message: "Data Show Successfully",
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving data",
    });
  }
};
