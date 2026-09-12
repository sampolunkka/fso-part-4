import axios from 'axios';
const personsEndpointUri = '/api/persons';

const getAll = () => {
    return axios.get(personsEndpointUri)
        .catch(error => {
            console.log(`Error fetching persons: ${error}`);
            throw error;
        });
};

const create = (newPerson) => {
    return axios.post(personsEndpointUri, newPerson)
        .catch(error => {
            console.log(`Error creating person: ${error}`);
            throw error;
        });
};

const update = (id, updatedPerson) => {
    return axios.put(`${personsEndpointUri}/${id}`, updatedPerson)
        .catch(error => {
            console.log(`Error updating person: ${error}`);
            throw error;
        });
};

const remove = (id) => {
    return axios.delete(`${personsEndpointUri}/${id}`)
        .catch(error => {
            console.log(`Error deleting person: ${error}`);
            throw error;
        });
};

const getById = (id) => {
    return axios.get(`${personsEndpointUri}/${id}`)
        .catch(error => {
            console.log(`Error fetching person by id: ${error}`);
            throw error;
        });
}

export default { getAll, create, update, remove, getById };