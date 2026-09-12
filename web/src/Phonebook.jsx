import React from "react";

const PhonebookRow = ({person, onDelete}) => {
    return (
        <div>
            {person.name} {person.number}&nbsp;
            <button
                onClick={() => onDelete(person)}>delete
            </button>
        </div>
    );
};

const Phonebook = ({persons, handleDelete}) => {
    return (
        <div>
            {persons.map((person, index) =>
                <PhonebookRow
                    key={index}
                    person={person}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default Phonebook;