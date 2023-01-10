import {
  createUserService,
  loginUserService,
  getDetailUserService,
  searchUserService,
  updateUserService,
  deleteUserService,
  getUserService,
  refreshTokenService
} from "../services/UserService.js";

export const userController = (req, res) => {
  res.send("user page");
};

export const detailUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const response = await getDetailUserService(userId);
      return res.json(response);
    }
    return res.json({
      status: "err",
      message: "The id is require",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: "err",
      message: err,
    });
  }
};
export const searchUserController = async (req, res) => {
  try {
    const { name } = req.query;
    if (name) {
      const response = await searchUserService(name);
      return res.json(response);
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: "err",
      message: err,
    });
  }
};
export const createUserController = async (req, res) => {
  const { email, password, name } = req.body;
  if (email && password && name) {
    const response = await createUserService({ email, password, name });
    return res.json(response);
  } else {
    return res.json({
      status: "err",
      message: "The email, password, name is require",
    });
  }
};
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const response = await loginUserService({ email, password });
    return res.json(response);
  } else {
    return res.json({
      status: "err",
      message: "The email and password is require",
    });
  }
};
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (id) {
      const response = await updateUserService(id, data);
      if (response) {
        return res.json(response);
      } else {
        return res.json({
          status: "err",
          message: "The server is problem",
        });
      }
    } else {
      return res.json({
        status: "err",
        message: "The id of user is required",
      });
    }
  } catch (error) {
    return res.json({
      status: "err",
      message: error,
    });
  }
};
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const response = await deleteUserService(id);
      return res.status(200).json(response);
    } else {
      return res.status(200).json({
        status: "err",
        message: "The id is required",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
export const getUserController = async (req, res) => {
  try {
    const response = await getUserService();
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

export const refreshTokenController = async (req,res) => {
  try {
    const refreshToken = req.headers.token.split(' ')[1]
    console.log(refreshToken)
    if(refreshToken){
      const response = await refreshTokenService(refreshToken)
      return res.json(response)
    }else{
      return res.json({
        message:"The refresh token is not valid"
      })
    }
  } catch (error) {
      return res.json({
        status:'error',
        message:error
      })
  }
}