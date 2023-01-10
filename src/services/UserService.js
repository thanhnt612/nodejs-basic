import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Process API
export const createUserService = ({ email, password, name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
      if (isEmail) {
        const isCheckEmail = await User.find({ email: email });
        const isCheckName = await User.find({ name: name });
        if (isCheckEmail.length || isCheckName.length) {
          resolve({
            status: 400,
            message: "The name or user nam is existed",
          });
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
          email,
          name,
          password: hashPassword,
        });
        console.log(newUser);
        resolve({
          status: 200,
          data: {
            email: newUser.email,
            name: newUser.name,
          },
        });
      } else {
        resolve({
          status: 400,
          message: "user name is not a email",
        });
      }
    } catch (error) {
      reject({
        message: error,
        status: 400,
      });
    }
  }).catch((e) => console.log(e));
};

const generalAccessToken = (data) => {
  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
  return access_token
};

const generalRefreshToken = (data) => {
  const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
  return refresh_token
};

export const loginUserService = ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
      if (isEmail) {
        const useDb = await User.find({ email: email });
        if (useDb) {
          const checkPassword = bcrypt.compareSync(password, useDb[0].password);
          if (checkPassword) {
            const access_token = generalAccessToken({ isAdmin: useDb[0].isAdmin, _id: useDb[0]._id });
            const refresh_token = generalRefreshToken({ isAdmin: useDb[0].isAdmin, _id: useDb[0]._id });
            resolve({
              status: 200,
              message: "Login successfully",
              data: {
                email: useDb[0].email,
                access_token,
                refresh_token
              },
            });
          }
          resolve({
            status: 204,
            message: "The user name or password is wrong",
          });
        } else {
          resolve({
            status: 204,
            message: "the user name is not existed",
          });
        }
      } else {
        resolve({
          status: 204,
          message: "user name is not a email",
        });
      }
    } catch (error) {
      reject({
        message: error,
        status: 400,
      });
    }
  }).catch((e) => console.log(e));
};

export const getDetailUserService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findUser = await User.findById(userId);
      if (findUser) {
        resolve({
          status: 200,
          data: findUser,
        });
      }
      resolve({
        status: 204,
        message: "FindUser is not defined",
      });
    } catch (err) {
      reject({
        message: err,
        status: 400,
      });
    }
  }).catch((e) => console.log(e));
};

export const searchUserService = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findName = await User.find({ name });
      if (findName) {
        resolve({
          status: 200,
          data: findName,
        });
      }
      resolve({
        status: 204,
        message: "The user is not defined",
      });
    } catch (err) {
      console.log(err);
      reject({
        message: err,
        status: 400,
      });
    }
  }).catch((e) => console.log(e));
};

export const updateUserService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne(data);
      console.log("checkUser", checkUser);
      if (checkUser) {
        resolve({
          status: 204,
          message: "The user is duplicate",
        });
      }
      const findUser = await User.findById(id);
      findUser.name = data.name;
      findUser.password = data.password;
      await findUser.save();
      if (findUser) {
        const getNewUser = await getDetailUserService(id);
        resolve({
          status: 200,
          message: "Updated successfully",
          data: findUser,
        });
      } else {
        resolve({
          status: 204,
          message: "The user is not defined",
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: 400,
        massage: error,
      });
    }
  }).catch((e) => console.log(e));
};

export const deleteUserService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteUser = await User.findByIdAndDelete(id);
      if (deleteUser) {
        resolve({
          status: 200,
          message: "Deleted successfully ",
        });
      } else {
        resolve({
          status: 204,
          message: "The user is not defined",
        });
      }
    } catch (error) {
      reject({
        status: 400,
        massage: error,
      });
    }
  }).catch((e) => console.log(e));
};

export const getUserService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllUser = await User.find();
      resolve({
        status: "OK",
        data: getAllUser,
      });
    } catch (error) {
      reject({
        status: 400,
        message: error,
      });
    }
  });
};

export const refreshTokenService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) {
          resolve(404).json({
            message: "The user is not Administrator",
          });
        }
        if (user) {
          const newAccessToken = generalAccessToken({isAdmin: user.isAdmin, _id: user._id})
          resolve({
            status:"OK",
            access_token:newAccessToken
          })
        } else {
          resolve({
            message: "The user is not Administrator",
          });
        }
      });
    } catch (error) {
      reject(error)
    }
  }).catch(e => console.log(e))
}