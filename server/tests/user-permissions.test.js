import assert from "node:assert/strict";
import UserModel from "../models/user.model.js";
import { deleteUser, updateUserRole } from "../controllers/user.controller.js";

const originalFindById = UserModel.findById;
const originalCountDocuments = UserModel.countDocuments;
const originalFindByIdAndDelete = UserModel.findByIdAndDelete;

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
  UserModel.countDocuments = originalCountDocuments;
  UserModel.findByIdAndDelete = originalFindByIdAndDelete;
};

export const runUserPermissionTests = async () => {
  try {
    {
      const request = {
        params: { id: "user-1" },
        body: { role: "SUPERADMIN" },
        userId: "admin-1",
      };
      const response = createResponse();

      await updateUserRole(request, response);

      assert.equal(response.statusCode, 400);
      assert.equal(response.body?.message, "Invalid role value");
      resetMocks();
    }

    {
      UserModel.findById = async () => ({
        _id: "admin-1",
        role: "ADMIN",
        save: async () => {},
      });

      const request = {
        params: { id: "admin-1" },
        body: { role: "USER" },
        userId: "admin-1",
      };
      const response = createResponse();

      await updateUserRole(request, response);

      assert.equal(response.statusCode, 400);
      assert.equal(response.body?.message, "You cannot remove your own admin role");
      resetMocks();
    }

    {
      UserModel.findById = async () => ({
        _id: "admin-2",
        role: "ADMIN",
        save: async () => {},
      });
      UserModel.countDocuments = async () => 1;

      const request = {
        params: { id: "admin-2" },
        body: { role: "USER" },
        userId: "admin-1",
      };
      const response = createResponse();

      await updateUserRole(request, response);

      assert.equal(response.statusCode, 400);
      assert.equal(response.body?.message, "At least one admin account must remain");
      resetMocks();
    }

    {
      UserModel.findById = async () => ({
        _id: "admin-1",
        role: "ADMIN",
        avatar: "",
      });

      const request = {
        params: { id: "admin-1" },
        userId: "admin-1",
      };
      const response = createResponse();

      await deleteUser(request, response);

      assert.equal(response.statusCode, 400);
      assert.equal(response.body?.message, "You cannot delete your own admin account");
      resetMocks();
    }

    {
      UserModel.findById = async () => ({
        _id: "admin-2",
        role: "ADMIN",
        avatar: "",
      });
      UserModel.countDocuments = async () => 1;
      UserModel.findByIdAndDelete = async () => ({});

      const request = {
        params: { id: "admin-2" },
        userId: "admin-1",
      };
      const response = createResponse();

      await deleteUser(request, response);

      assert.equal(response.statusCode, 400);
      assert.equal(response.body?.message, "At least one admin account must remain");
      resetMocks();
    }

    return {
      name: "user-permissions",
      passed: 5,
    };
  } catch (error) {
    resetMocks();
    throw error;
  }
};
