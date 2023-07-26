const backBlazeSingle = require('../configs/backBlazeSingle');
const Project = require('../models/Project.schema');

const addProject = async (req, res) => {
    const obj = JSON.parse(req.body.obj);

    if (req.files.requirements && req.files.requirements.length) {
        const url = await backBlazeSingle(req.files.requirements[0]);

        obj.requirements = url;
    }
 
    try {
        console.log('🌼 🔥🔥 file: project.controller.js:15 🔥🔥 addProject 🔥🔥 obj🌼', obj);

        const projects = await Project.create(obj );
      
     
        res.status(201).json({
            status: 'success',
            message: 'Projects Request added successfully',
        });
    } catch (error) {
        console.log('🌼 🔥🔥 file: project.controller.js:25 🔥🔥 addProject 🔥🔥 error🌼', error);

        
        res.status(401).json({ status: 'failed', message: error.message });
    }
};
module.exports = addProject;
