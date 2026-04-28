import assert from "node:assert/strict";
import UserModel from "../models/user.model.js";
import requireRole from "../middleware/requireRole.js";

const originalFindById = UserModel.findById;

const createResponse = () => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

const resetMocks = () => {
  UserModel.findById = originalFindById;
};

export const runRequireRoleTests = async () => {
  try {
    {
      const middleware = requireRole("ADMIN");
      const request = {};
      const response = createResponse();
      let calledNext = false;

      await middleware(request, response, () => {
        calledNext = true;
      });

      assert.equal(response.statusCode, 401);
      assert.equal(response.body?.message, "Unauthorized access");
      assert.equal(calledNext, false);
      resetMocks();
    }

    {
      UserModel.findById = () => ({
        select: async () => ({
          role: "USER",
        }),
      });

      const middleware = requireRole("ADMIN");
      const request = { userId: "user-1" };
      const response = createResponse();
      let calledNext = false;

      await middleware(request, response, () => {
        calledNext = true;
      });

      assert.equal(response.statusCode, 403);
      assert.equal(
        response.body?.message,
        "You do not have permission to access this resource",
      );
      assert.equal(calledNext, false);
      resetMocks();
    }

    {
      UserModel.findById = () => ({
        select: async () => ({
          role: "ADMIN",
        }),
      });

      const middleware = requireRole("ADMIN");
      const request = { userId: "admin-1" };
      const response = createResponse();
      let calledNext = false;

      await middleware(request, response, () => {
        calledNext = true;
      });

      assert.equal(calledNext, true);
      assert.equal(request.userRole, "ADMIN");
      assert.equal(response.body, null);
      resetMocks();
    }

    return {
      name: "requireRole",
      passed: 3,
    };
  } catch (error) {
    resetMocks();
    throw error;
  }
};
