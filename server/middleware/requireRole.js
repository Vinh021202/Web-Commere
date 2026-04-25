import UserModel from "../models/user.model.js";

const requireRole = (...allowedRoles) => {
  return async (request, response, next) => {
    try {
      if (!request.userId) {
        return response.status(401).json({
          message: "Unauthorized access",
          error: true,
          success: false,
        });
      }

      const user = await UserModel.findById(request.userId).select("role");

      if (!user) {
        return response.status(401).json({
          message: "User not found",
          error: true,
          success: false,
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return response.status(403).json({
          message: "You do not have permission to access this resource",
          error: true,
          success: false,
        });
      }

      request.userRole = user.role;
      next();
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
};

export default requireRole;
