import Organization  from "../Models/organizationModel.js";

//Organization ADD Data Api
export const organizationAddData = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({
      success: false,
      messege: error.messge || "Error Fetching Organization",
    });
  }
}