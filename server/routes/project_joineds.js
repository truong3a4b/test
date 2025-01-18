const express = require('express')
const router = express.Router()
const { Users, ProjectJoineds, Projects } = require('../models')
const { validateToken } = require('../middleware/auth');
const { where } = require('sequelize');
require('dotenv').config();


// Get participants ==============================================================
router.get("/participants", validateToken, async (req, res) => {
    const { project_id } = req.query
    try {
        const joineds_Projecs = await ProjectJoineds.findAll({
            where:
            {
                project_id: project_id
            }
        })
        const participant_ids = joineds_Projecs.map((join) => join.participant_id)
        const participants = []
        for (let participant_id of participant_ids) {
            const user = await Users.findByPk(participant_id)
            participants.push(user)
        }
        res.json({ message: true, participants })

    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message
        });
    }
})

// Joined a project with project_id  ================================== author: Hai
// logined user -<join>--> project ------------------------------------------------
// POST: http://localhost:3001/project-joineds/
/*{
    project_id: ,
    isManager: 
}*/
router.post("/", validateToken, async (req, res) => {

    const { project_id, isManager } = req.body
    const userId = req.user['user'].id;

    try {

        const isExist = await ProjectJoineds.findOne({
            where: {
                project_id: project_id,
                participant_id: userId
            }
        })
        if (isExist) {
            const err = new Error("Server: This Joineds already exist!");
            err.status = 400;
            throw err;
        }

        const project = await Projects.findByPk(project_id);
        if (!project) {
            const err = new Error("Server: Project not found !");
            err.status = 400;
            throw err;
        };

        const newRecord = await ProjectJoineds.create({
            project_id, participant_id: userId, isManager
        })

        return res.json({ success: true, message: "Server: Joined-project created", id: newRecord.id })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message
        });
    }
})


// Remove joiner <manager only>-----------------------------------------------------
// DELETE: http://localhost:3001/project-joineds/remove
/* 
{
    project_id: "",
    joinerId: "",
}
*/
router.delete("/remove", validateToken, async (req, res) => {
    // remove information
    const { project_id, joiner_id } = req.body
    // manager
    const managerId = req.user['user'].id;

    try {
        const Manager_joinedRecord = await ProjectJoineds.findOne({
            where: {
                project_id: project_id,
                participant_id: managerId,
                isManager: true
            }
        })
        if (!Manager_joinedRecord) {
            const err = new Error(`Server: Logined user does not manage project with ID: ${project_id}`);
            err.status = 400;
            throw err;
        }

        const removeJoiner = await ProjectJoineds.destroy({
            where: {
                participant_id: joiner_id,
                project_id: project_id,
                isManager: false
            }
        })

        if (!removeJoiner) {
            const err = new Error(`Server: Remove joiner false ! <maybe Joiner doesn't exist in this project> `);
            err.status = 400;
            throw err;
        }
        return res.json({ success: true, message: `Removed joiner ID:${joiner_id} from project ID: ${project_id} !` })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message
        });
    }

})


// Leave Project <joiner only>---------------------------------------------------
/* DELETE: http://localhost:3001/joins-project/leave
{
    project_id: 
}
*/
router.delete("/leave", validateToken, async (req, res) => {
    const { project_id } = req.body
    // joiner
    const joiner_id = req.user['user'].id;

    try {
        const Joined_record = await ProjectJoineds.findOne({
            where: {
                project_id: project_id,
                participant_id: joiner_id,
                isManager: false
            }
        })
        if (!Joined_record) {
            const err = new Error(`Server: Logined user does not in project as JOINER with ID: ${project_id}`);
            err.status = 400;
            throw err;
        }

        const leaveProject = await ProjectJoineds.destroy({
            where: {
                participant_id: joiner_id,
                project_id: project_id,
                isManager: false
            }
        })

        if (!leaveProject) {
            const err = new Error(`Server: Leave project false ! <await ProjectJoineds.destroy> false `);
            err.status = 400;
            throw err;
        }
        return res.json({ success: true, message: `Left project ID: ${project_id} !` })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message
        });
    }

})


module.exports = router