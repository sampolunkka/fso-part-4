import React, {useEffect} from 'react';
import {useState} from 'react';
import Phonebook from "./Phonebook.jsx";
import PersonForm from "./PersonForm.jsx";
import SearchFilter from "./SearchFilter.jsx";
import Notification, {NotificationType} from "./Notification.jsx";
import restClient from "./services/restClient.jsx";

const SUCCESS_CREATE_MESSAGE = (name) => `Added ${name}`;
const SUCCESS_UPDATE_MESSAGE = (name) => `Updated ${name}`;
const SUCCESS_DELETE_MESSAGE = (name) => `Deleted ${name}`;
const ERROR_CREATE_MESSAGE = 'Error creating person';
const ERROR_UPDATE_MESSAGE = 'Error updating person';
const ERROR_DELETE_MESSAGE = 'Error deleting person';
const ERROR_DELETE_NOT_FOUND_MESSAGE = (name) => `Information of ${name} has already been removed from server`;
const ERROR_FETCH_MESSAGE = 'Error fetching persons';

// In the example all strings are case-sensitive and not trimmed.
// In this implementation, names are normalized byt the following function,
// which should result in better user experience, since we don't require
// exact matches when searching or checking for duplicates.
const normalizeName = (name) => {
    return name.toLowerCase().trim();
};

const nameNormalizedIsUniqueInCollection = (name, persons) => {
    return !persons.filter(person => normalizeName(person.name) === normalizeName(name)).length;
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [notificationType, setNotificationType] = useState(null);

    const refreshFilteredPersons = (personsArray, filterString) => {
        const filterNormalized = normalizeName(filterString);
        if (filterNormalized.length) {
            const filteredPersons = personsArray.filter(person => {
                const personNameNormalized = normalizeName(person.name);
                return personNameNormalized.includes(filterNormalized);
            });
            setFilteredPersons(filteredPersons);
        } else {
            setFilteredPersons(personsArray);
        }
    };

    const getAllPersons = () => {
        return restClient.getAll()
            .then(response => {
                setPersons(response.data);
                refreshFilteredPersons(response.data, filter);
                return response;
            })
            .catch(error => handleErrorNotification(ERROR_FETCH_MESSAGE, error));
    };

    useEffect(() => {
        getAllPersons();
    }, []);

    const postPerson = (person) => {
        return restClient.create(person)
            .then(response => {
                const newPersons = persons.concat(response.data);
                setPersons(newPersons);
                setNewName('');
                setNewNumber('');
                refreshFilteredPersons(newPersons, filter);
                handleSuccessNotification(SUCCESS_CREATE_MESSAGE(person.name));
            }).catch(error => {
                console.log(error.response.data);
                handleErrorNotification(ERROR_CREATE_MESSAGE, error);
            });
    };

    const putPerson = (id, updatedPerson) => {
        return restClient.update(id, updatedPerson)
            .then(response => {
                const updatedCollection = persons.map(person =>
                    person.id === id ? response.data : person
                );
                setPersons(updatedCollection);
                refreshFilteredPersons(updatedCollection, filter);
                setNewName('');
                setNewNumber('');
                handleSuccessNotification(SUCCESS_UPDATE_MESSAGE(updatedPerson.name));
            }).catch(error => handleErrorNotification(ERROR_UPDATE_MESSAGE, error));
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        refreshFilteredPersons(persons, newFilter);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const isUnique = nameNormalizedIsUniqueInCollection(newName, persons);

        if (!isUnique) {
            const existingPerson = persons.find(person =>
                normalizeName(person.name) === normalizeName(newName)
            );

            if (!window.confirm(`${newName} is already in the phonebook. Replace the number?`)) {
                return;
            }

            const updatedPerson = { ...existingPerson, number: newNumber };
            putPerson(existingPerson.id, updatedPerson);
        } else {
            postPerson({ name: newName, number: newNumber });
        }
    };

    const handleDelete = (person) => {
        if (!window.confirm(`Delete ${person.name}?`)) return;
        restClient.remove(person.id)
            .then(() => handleNotification(SUCCESS_DELETE_MESSAGE(person.name), NotificationType.SUCCESS))
            .catch(error => { error.response?.status === 404
                    ? handleErrorNotification(ERROR_DELETE_NOT_FOUND_MESSAGE(person.name), error)
                    : handleErrorNotification(ERROR_DELETE_MESSAGE, error);
            }).finally(getAllPersons);
    };

    const handleErrorNotification = (message, error) => {
        const errorMessage = error?.response?.data?.error;
        handleNotification(errorMessage ? `${message}: ${errorMessage}` : message, NotificationType.ERROR);
    }

    const handleSuccessNotification = (message) => {
        handleNotification(message, NotificationType.SUCCESS);
    }

    const handleNotification = (message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
        }, 5000);
    };

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notificationMessage} type={notificationType}/>
            <h2>Filter entries</h2>
            <SearchFilter handleFilterChange={handleFilterChange}/>
            <h2>Add new entry</h2>
            <PersonForm
                handleSubmit={handleSubmit}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h2>Entries</h2>
            <Phonebook
                persons={filteredPersons}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default App;