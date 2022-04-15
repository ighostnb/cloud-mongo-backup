Mongo backup library with mongoose

installing: 
  npm i @ighostnb/cloud-mongo-backup ;
  
using:
  To use it, you need to create a mongoose model:
ES5
    
file Backup.js: 
    
      const mongoose = require('mongoose');

      const backupSchema = new mongoose.Schema({
        time: {
          type: Number,
          required: true,
        },
        data: {
          type: String,
          required: true,
        },
      });

      module.exports = mongoose.model('Backup', backupSchema);

other file: 
      
      const backup = require('@ighostnb/mongo-cloud-backup');
      const Backup = require('./models/Backup'); // path to Backup.js
      
      // Then you need to register the dependencies to the models. For example:
      const UserModel = require('./models/User');
      const CompanyModel = require('./models/Company');
      
      const models = [UserModel, CompanyModel]; // Specify the models you want to save
      
      backup.getJsonFile(models, 'the path to the save folder'); // Saves the backup to a folder
      
      backup.saveBackupInCloud(models, Backup); // Save the backup in cloud mongodb
      
      backup.restoreBackupFromFile('path to backup file', models); // Restores a database from a file
      
      backup.restoreBackupFromCloud(models, Backup, 'backup id from mongodb'); // Restores a database from cloud mongodb
      
ES6
    
file Backup.js:
    
    import mongoose from 'mongoose';
    
    const { model, Schema } = mongoose;
    
    export default model('Backup', Schema({
      time: {
        type: Number,
        required: true,
      },
      data: {
        type: String,
        required: true,
      },
    }));
    
other file: 
      
      import { getJsonFile, saveBackupInCloud, restoreBackupFromFile, restoreBackupFromCloud } from '@ighostnb/mongo-cloud-backup';
      import Backup from './models/Backup.js'; // path to Backup.js
      
      // Then you need to register the dependencies to the models. For example:
      import UserModel from './models/User.js';
      import CompanyModel from './models/Company.js';
      
      const models = [UserModel, CompanyModel]; // Specify the models you want to save
      
      getJsonFile(models, 'the path to the save folder'); // Saves the backup to a folder
      
      saveBackupInCloud(models, Backup); // Save the backup in cloud mongodb
      
      restoreBackupFromFile('path to backup file', models); // Restores a database from a file
      
      restoreBackupFromCloud(models, Backup, 'backup id from mongodb'); // Restores a database from cloud mongodb
