import userService from '../service/userService.js';
import Plan from '../db/Plan.js';
import User from '../db/User.js';
import pkg from 'body-parser';
const { json } = pkg;

const getUserInfo = async (req, res) => {
    const user = await userService.getUserInfo(req.params.id);
    if (user.error) { 
      res.status(user.code).send({ 
        status: false,
        message: user.error
      });
      return;
    }
    res.status(201).send({ 
      status: true, 
      message: 'Informacion del Usuario Obtenida',
      data: user
    });
    return;
};
const editUser = async (req, res) => {
  
  let body = req.body
  // body = JSON.parse(req.body)
  const user = await User.editUserInfo(req.params.cusuario, body);
  if (user.error) { 
    res.status(user.code).send({ 
      status: false,
      message: user.error
    });
    return;
  }
  res.status(201).send({ 
    status: true, 
    message: 'Usuario Editado',
    data: user
  });
  return;
};
const getINMAInfo = async (req, res) => {
    const inmaInfo = await userService.getINMAInfo(req.params.inma);
    if (inmaInfo.error) { 
      res.status(inmaInfo.code).send({ 
        status: false,
        message: inmaInfo.error
      });
      return;
    }
    res.status(201).send({ 
      status: true, 
      message: 'Informacion del vehículo del Usuario Obtenida',
      data: inmaInfo
    });
    return;
};

export default {
  getUserInfo,
  getINMAInfo,
  editUser
}