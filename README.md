Mongo backup library with mongoose

installing: 
  git clone https://github.com/ighostnb/cloud-mongo-backup.git ;
  npm install {path}
  
using:
  To use it, you need to create a mongoose model:
    
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
      
      const backup = require('mongo-cloud-backup');
      const Backup = require('./models/Backup'); // path to Backup.js
      
      // Then you need to register the dependencies to the models. For example:
      const UserModel = require('./models/User');
      const CompanyModel = require('./models/Company');
      
      const models = [UserModel, CompanyModel]; // Specify the models you want to save
      
      backup.getJsonFile(models, 'the path to the save folder'); // Saves the backup to a folder
      
      backup.saveBackupInCloud(models, Backup); // Save the backup in cloud mongodb
      
      backup.restoreBackupFromFile('path to backup file', models); // Restores a database from a file
      
      backup.restoreBackupFromCloud(models, Backup, 'backup id from mongodb'); // Restores a database from cloud mongodb
      
  
