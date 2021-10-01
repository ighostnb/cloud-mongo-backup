const fs = require('fs');

exports.getJsonFile = async (models, path) => {
    let json = await getData(models);
    
    fs.writeFile(path + Date.now() + '.txt', json, (error) => {
        if (error) console.log(error);
        console.log('The backup was successfully created');
    });
};

exports.saveBackupInCloud = async (models, Backup) => {
    try {
        let json = await getData(models);

        const backup = new Backup({
            time: Date.now(),
            data: json, 
        });

        await backup.save();
        
        console.log('The backup was successfully saved in the database');
    } catch (error) {
        console.log(error);
    }
};

exports.restoreBackupFromCloud = async (models, backup, id) => {
    backup.findById({ _id: id }).then(async (result) => {
        if (!result) {
            console.log('No such backup with same id');
            return;
        }

        for (var i in models) {
            await models[i].deleteMany();
        }

        let json = result.data;
        json = JSON.parse(json);

        for (var i in models) {
            let data = json[models[i].collection.name];
            data.forEach(async (el) => {
                let element = models[i](el);
                await element.save();
            });
        }

        console.log('Database was sucessfully restored from cloud');
    });
};

exports.restoreBackupFromFile = async (filePath, models) => {
    fs.readFile(filePath, async (err, data) => {
        if (err) {
          console.log('No such file or directory');
          return;
        }

        let json = data.toString();

        for (var i in models) {
            await models[i].deleteMany();
        }

        json = JSON.parse(json);
        for (var i in models) {
            let data = json[models[i].collection.name];
            data.forEach(async (el) => {
                let element = models[i](el);
                await element.save();
            });
        }

        console.log('Database was sucessfully restored from file');
    });

}

async function getData(models) {
    let json = {};
    
    try {
        for (let i in models) {
            await models[i].find({}).then((result) => {
                json[models[i].collection.name] = result;
            });
        }
    } catch (error) {
        console.log(error);
    }

    return JSON.stringify(json);
}