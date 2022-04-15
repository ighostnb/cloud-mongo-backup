import fs from 'fs';

const { writeFile, readFile } = fs;

export async function getJsonFile(models, path) {
    try {
        let json = await getData(models);
    
        writeFile(path + Date.now() + '.txt', json, (error) => {
            if (error) console.log(error);
            console.log('The backup was successfully created');
        });    
    } catch (error) {
        console.log(error);   
    }
}

export async function saveBackupInCloud(models, Backup) {
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
}

export async function restoreBackupFromCloud(models, backup, id) {
    try {
        backup.findById({ _id: id }).then(async (result) => {
            if (!result) {
                console.log('No such backup with same id');
                return;
            }
    
            for (let i in models) {
                await models[i].deleteMany();
            }
    
            let json = result.data;
            json = JSON.parse(json);
    
            for (let i in models) {
                let data = json[models[i].collection.name];
                data.forEach(async (el) => {
                    let element = models[i](el);
                    await element.save();
                });
            }
    
            console.log('Database was sucessfully restored from cloud');
        });    
    } catch (error) {
        console.log(error);
    }
    
}

export async function restoreBackupFromFile(filePath, models) {
    try {
        readFile(filePath, async (err, data) => {
            if (err) {
              console.log('No such file or directory');
              return;
            }
    
            let json = data.toString();
    
            for (let i in models) {
                await models[i].deleteMany();
            }
    
            json = JSON.parse(json);
            for (let i in models) {
                let data = json[models[i].collection.name];
                data.forEach(async (el) => {
                    let element = models[i](el);
                    await element.save();
                });
            }
    
            console.log('Database was sucessfully restored from file');
        });
    } catch (error) {
        console.log(error);
    }
}

async function getData(models) {
    try {
        let json = {};

        for (let i in models) {
            await models[i].find({}).then((result) => {
                json[models[i].collection.name] = result;
            });
        }

        return JSON.stringify(json);
    } catch (error) {
        console.log(error);
    }
}
