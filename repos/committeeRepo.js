const { Committee } = require('../models/index')


const getAllCommittees = async () => {
    const committees = await Committee.findAll({ attributes: ['committee_id', 'committee_name'] })
    return committees
}

const getCommitteeById = async (id) => {
    const committee = await Committee.findAll({ where: { committee_id: id }, attributes: ['committee_id', 'committee_name'] })
    return committee
}

const createCommittees = () => {
    try {
        committeesList.map(com => {
            Committee.create({ committee_name: com.committee_name })
        })
    } catch (error) {
        console.log(error)
    }

}

const CommitteeRepo = {
    getAllCommittees,
    createCommittees,
    getCommitteeById
}

module.exports = { CommitteeRepo }
