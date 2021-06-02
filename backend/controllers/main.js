const token = require("jsonwebtoken");
const User = require("../models/user");
const c = require("../util/const");
const helper = require("../util/helper");
const logger = require("../util/log");

exports.getHelloWorld = (req, res, next) => {
  res.status(200).json({
    message: "Hello World",
  });
};

exports.doNothing = (req, res, next) => {
  res.status(200).json({});
};

exports.postMessage = (req, res, next) => {
  const header = req.body.header;
  const content = req.body.content;

  res.status(201).json({
    statusmessage: "Message posted successfully",
    post: { id: new Date().toISOString(), header: header, content: content },
  });
};


exports.getUsers = async (req, res, next) => {
  try {
    //NKN Start
    logger.debug({
    message: 'What time is the testing at?'
    });
    //NKN End
    let result = new Array(0);
    if (helper.isEmpty(req.query)) {
      result = await User.getByIds(req.params.ids);
    } else {
      try {
        result = await User.filter(req.query);
      } catch (err) {
        if (err.errno != c.ERR_DB_UNKONW_COLUMN) {
          throw err;
        }
      }
    }
    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUsers = async (req, res, next) => {
  
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const avatar = req.body.avatar;
  const pwd = req.body.pwd;

  try {
    await User.add(
      firstname,
      lastname,
      username,
      pwd,
      avatar
      );

    let result = await User.getByUsername(username);
    res.status(c.HTTP_STATUS_CREATED).json(result);
  }
  catch (err){
    if (err.errno == c.ERR_DB_DUP_ENTRY)
    {
      err.statusCode = c.HTTP_STATUS_CONFLICT;
      err.message = "User already exists";
    }
    else
    {
      err.statusCode = c.HTTP_STATUS_INETERNAL_SERVER_ERROR
      err.message = "connect ECONNREFUSED 127.0.0.1:3306";
    }
    next(err);
  }
};

exports.postLogins = async (req, res, next) => {
  
  const username = req.body.username;
  const pwd = req.body.pwd;

  try {
      let userToCheck = await User.getByUsername(username);
      if (userToCheck.pwd == pwd) {
        console.log("Pwd: " + pwd)
        res.status(c.HTTP_STATUS_OK).json(userToCheck);
      }
      else {
        res.status(c.HTTP_STATUS_UNAUTHORIZED).json(userToCheck); //json(userToCheck)???
      }
  }
  catch(err){
    console.log("Error Number is: " + err.errno);
    // if (err.errno == c.HTTP_STATUS_UNAUTHORIZED)
    // {
    //   err.statusCode = c.HTTP_STATUS_UNAUTHORIZED;
    //   err.message = "Authentication failed.";
    // }
    next(err);
  }
};