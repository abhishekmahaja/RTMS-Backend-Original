import Device from "../Models/deviceManagerModel.js";

// POST /generate-publish-security-code
export const generatePublishSecurityCode = async (req, res) => {
  try {
    const publishCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    res.json({
      success: true,
      message: "Generated Publish Code successfully",
      data: publishCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error generating Publish Code",
    });
  }
};

// POST /generate-subscribe-security-code
export const generateSubscribeSecurityCode = async (req, res) => {
  try {
    const subscribeCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    res.json({
      success: true,
      message: "Generated Subscribe Code successfully",
      data: subscribeCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error generating Subscribe Code",
    });
  }
};

// GET /all-devices
export const allDevice = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json({
      success: true,
      message: "All devices retrieved successfully",
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching devices",
    });
  }
};

// GET /device/:id
export const getOneDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Device retrieved successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching device",
    });
  }
};

// POST /submit-well-settings
export const submitDeviceData = async (req, res) => {
  try {
    const {
      MACAddress,
      selectWell,
      publishSecurityCode,
      subscribeSecurityCode,
      parameter,
    } = req.body;
    const wellDevice = new Device({
      MACAddress,
      selectWell,
      publishSecurityCode,
      subscribeSecurityCode,
      parameter,
    });
    await wellDevice.save();
    res.json({
      success: true,
      message: "Well settings submitted successfully",
      device: wellDevice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting well settings",
    });
  }
};

// update the device /PUT
export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateDevice = await Device.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!updateDevice) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      success:true,
      message: "Device Updated Successfully",
      data: updateDevice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error To UPDATE Device"
    });
  }
}

// Delete the device /DELETE
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDevice = await Device.findByIdAndDelete(id);
    if(!deleteDevice) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      success:true,
      message: "Device Updated Successfully",
      data: deleteDevice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error To UPDATE Device"
    });
  }
}