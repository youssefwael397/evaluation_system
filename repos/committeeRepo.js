const { Committee } = require('../models/index')

const committeesList = [
    {
        committee_name: 'WEB',
    },
    {
        committee_name: 'ANDROID',
    },
    {
        committee_name: 'HRM',
    },
    {
        committee_name: 'HRD',
    },
    {
        committee_name: 'ACADEMY',
    },
    {
        committee_name: 'BD',
    },
    {
        committee_name: 'E4ME',
    },
    {
        committee_name: 'EXTRA',
    },
    {
        committee_name: 'IR',
    },
    {
        committee_name: 'LOGISTICS',
    },
    {
        committee_name: 'MULTIMEDIA',
    },
    {
        committee_name: 'Magazine_Designs',
    },
    {
        committee_name: 'Magazine_Editing',
    },
    {
        committee_name: 'OC',
    },
    {
        committee_name: 'OFFLINE_MARKETING',
    },
    {
        committee_name: 'SOCIAL_MEDIA',
    },
    {
        committee_name: 'DATA SCINCE',
    },
]


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