const { BadRequestError, UnauthenticatedError } = require('../errors');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');


const register = async (req, res) => {
  const email = req?.body?.email;
  const isExist = await User.findOne({ email });

  if(isExist) {
    throw new BadRequestError('User already exist')
  }
  const user = await User.create({ ...req.body });

  const meta = await User.findOne({email})

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      username: user.username,
      img:user.img,
      meta
    },
  });
};

const login = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Please provide email')
  }
  const user = await User.findOne({ email });
  const adminUser = await Admin.findOne({ email });

  if(adminUser) {

    // Create token
    const token = adminUser.createJWT();
    res.status(StatusCodes.OK).json({
      user: {
        email: adminUser?.email,
        username: adminUser?.username,
        token,
        meta: adminUser
      },
    })
  }
   else if(user) {
    console.log('from else block')
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        username: user.username,
        token,
        meta:user
      },
    });
  }
  // return res.status(StatusCodes.OK).json({msg:'User not found'})
  
};

const registerAsAdmin = async (req, res) => {
  const email = req?.body?.email;
  const isExist = await User.findOne({ email });

  if(isExist) {
    throw new BadRequestError('User already exist')
  }
  const user = await Admin.create({ ...req.body });
  res.status(StatusCodes.CREATED).json(user);
}


const loginAsAdmin = async (req, res) => {
 console.log(req.body)
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Please provide email')
  }
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('User not found')
  }

  // compare token
  const meta = await Admin.findOne({email})
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      username: user.username,
      token,
      meta
    },
  });
}


const checkIsAdmin = async (req, res) => {
  const email = req?.body?.email;
  const isExist = await Admin.findOne({ email });
  res.status(StatusCodes.OK).json({admin: isExist});
}


const checkIsShopCreated = async (req, res) => {
  const email = req?.body?.email;
  const isExist = await User.findOne({ email });
  console.log(isExist)
  // res.status(StatusCodes.OK).json({admin: isExist});
}





module.exports = {
  registerAsAdmin,
  loginAsAdmin,
  register,
  login,
  checkIsAdmin,
  checkIsShopCreated
}
