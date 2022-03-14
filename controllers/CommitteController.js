const { CommitteeRepo } = require('../repos/committeeRepo')

const getAllCommittees = async () => {
    try {
        const coms = await CommitteeRepo.getAllCommittees()
        return coms
    } catch (error) {
        console.log('getAllCommittees error : ' + error)
    }
}


const createCommittees = () => {
    try {
        CommitteeRepo.createCommittees()
        console.log('committees created...')
    } catch (error) {
        console.log('createCommittees error: ' + error)
    }
}


const getCommitteeById = async (id) => {
    try {
        const com = await CommitteeRepo.getCommitteeById(id);
        return com;
    } catch (error) {

    }
}


const CommitteeController = {
    getAllCommittees,
    createCommittees,
    getCommitteeById
}

module.exports = { CommitteeController }