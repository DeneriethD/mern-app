import User from '../models/user.model';
import merge from 'lodash/merge';//merge es unir
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable'; // Librería que ayud al procesamiento del fomrulario.
import fs from 'fs'; // Es una librería que da acceso al sistema de archivos  del SO.

/**
 * Es la función de la librería lodash que nos permite extender los objetos defaul img, 
 * que sera la imagen por defecto que se establecerá al usuario.
 */

import {extend, result} from 'lodash'; 
import { exec } from 'child_process';

const create = async (req, res) => { // recibe las peticiones y respuesta
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: 'Successfully signed up!'
    });
  } catch (err) { // si la operación falla ejecuta estos procedimientos
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created');
    res.json(users);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const userById = async (req, res, next, id) => { 
  try {
    let user = await User.findById({_id: id})
    .populate('following', '_id name') //Cargará los usuarios seguidores y seguidos por esta cuenta y los retornará en al respuesta.
    .populate('followers','_id name')
    exec();


    if(!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    req.profile = user;
    next();
  } catch (err) { //capturara el error
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve user"
    });
  }
};

const read = (req, res) => { 
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.name = 'ss';
  return res.json(req.profile);
};

const update = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtension = true; //Encaragada de mantener los archivos que vienen en el request.
  form.parse(req, async(err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({
          error: 'Photo could not be uploaded'
        });
      }
      
      let user = req.profile;
      user = extend(user,fields);
      user.updated =Date.now();
      
      if (files.photo) {
        user.photo.data =fs.readFileSync(files.photo.filepath);
        user.photo.contentType = files.photo.type;
      }
      await user.save();
      user.hashed_password = '';
      user.salt = '';
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });  
    }
  });
};



const remove = async (req, res, next) => {
  try {
    console.log('deleted');
    let user = req.profile;
    console.log('user to remove', user);
    let deletedUser = await user.deleteOne();
    deletedUser.hashed_password = '';
    deletedUser.salt = '';
    res.json(deletedUser);
  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const addFollowers = async(req,res) => {

  try{
    const result = await User.findByIdAndUpdate(
      req.body.followld,
    {$push:{followers:req.body.userId}},
    {new:true}
    )
    .populate('following','_id name')
    .populate('followers','_id name')
    .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);

  }catch(err){
  return res.status(400).json({
    error: errorHandler.getErrorMessage(err)
  });
}
};

const defaulPhoto = (req,res) => {
  return res.sendFile('${process.cwd()}${defaulImage');
};

const addFollowing = async(req,res,next) => {

  try{
    const result = await User.findByIdAndUpdate(
      req.body.userId,
    {$push:{ following:req.body.addFollowers}});
    next();        
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const removeFollowers = async(req,res) => {
   try{
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {$pull: {  followers:req.body.userId  }},
      {new:true}
      
    )
    .populate('following','_id name')
    .populate('followers','_id name')
    .exec();
    res.json(result);

  }catch(err){
    return res.status(400).json({
      error:errorHandler.getErrorMessage()
    });
  }
};

const removeFollowing = async (req,res,next)=> {
  try{
    await User.findByIdAndUpdate(
      req.body.userId,
      {$pull: {following:req.body.unfollowId}});
      next();
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage()
      });

    }
  };




export default {
  create,
  list,
  read,
  remove,
  userById,
  update,
  defaulPhoto,
  addFollowers,
  addFollowing,
  removeFollowers,
  removeFollowing
};

