import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import { Wrapper, Title, SecondTitle } from './App.styled';
import data from '../data/contacts.json';

import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';

const App = () => {
  const [contactsList, setContactsList] = useState(() => {
    return JSON.parse(localStorage.getItem('contacts')) ?? data;
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contactsList));
  }, [contactsList]);

  const onDuplicateCheck = name => {
    return contactsList.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
  };

  const onFormSubmit = e => {
    e.preventDefault();
    const { name, number } = e.currentTarget.elements;

    const contact = {
      id: nanoid(4),
      name: name.value,
      number: number.value,
    };

    if (onDuplicateCheck(contact.name)) {
      e.currentTarget.reset();
      name.focus();
      Notiflix.Notify.failure(`${contact.name} is already in contacts`);
      // alert(`${contact.name} is already in contacts`);
      return;
    }

    setContactsList([contact, ...contactsList]);
    e.currentTarget.reset();
  };

  const onChangeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getVisibleContacts = () => {
    return contactsList
      .filter(contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const deleteContacts = contactId => {
    setContactsList(prev => prev.filter(contact => contact.id !== contactId));
  };

  return (
    <Wrapper>
      <Title>Phonebook</Title>
      <ContactForm onSubmit={onFormSubmit} />
      <SecondTitle>Contacts</SecondTitle>
      <Filter value={filter} onChange={onChangeFilter} />
      <ContactList
        contacts={getVisibleContacts()}
        onDeleteContacts={deleteContacts}
      />
    </Wrapper>
  );
};

export default App;

// export class App extends Component {
//   state = {
//     contacts: [],
//     filter: '',
//   };

//   componentDidMount() {
//     const contactsList = JSON.parse(localStorage.getItem('contacts'));

//     if (contactsList) {
//       this.setState({ contacts: contactsList });
//       return;
//     }

//     this.setState({ contacts: contactsData });
//   }

//   componentDidUpdate(_, prevState) {
//     const nextContacts = this.state.contacts;
//     const prevContacts = prevState.contacts;

//     if (nextContacts !== prevContacts) {
//       localStorage.setItem('contacts', JSON.stringify(nextContacts));
//     }
//   }

//   onDuplicateCheck = name => {
//     return this.state.contacts.some(contact => contact.name === name);
//   };

//   onFormSubmit = e => {
//     e.preventDefault();
//     const { name, number } = e.currentTarget.elements;

//     const contact = {
//       id: nanoid(4),
//       name: name.value,
//       number: number.value,
//     };

//     if (this.onDuplicateCheck(contact.name)) {
//       e.currentTarget.reset();
//       name.focus();
//       Notiflix.Notify.failure(`${contact.name} is already in contacts`);
//       // alert(`${contact.name} is already in contacts`);
//       return;
//     }

//     this.setState(({ contacts }) => ({
//       contacts: [contact, ...contacts],
//     }));

//     e.currentTarget.reset();
//   };

//   onChangeFilter = e => {
//     this.setState({ filter: e.currentTarget.value });
//   };

//   getVisibleContacts = () => {
//     const { filter, contacts } = this.state;
//     const normalizedFilter = filter.toLowerCase();

//     return contacts
//       .filter(contact => contact.name.toLowerCase().includes(normalizedFilter))
//       .sort((a, b) => a.name.localeCompare(b.name));
//   };

//   deleteContacts = contactId => {
//     this.setState(prevState => ({
//       contacts: prevState.contacts.filter(contact => contact.id !== contactId),
//     }));
//   };

//   render() {
//     const { filter } = this.state;
//     const visibleContacts = this.getVisibleContacts();

//     return (
//       <Wrapper>
//         <Title>Phonebook</Title>
//         <ContactForm onSubmit={this.onFormSubmit} />

//         <SecondTitle>Contacts</SecondTitle>
//         <Filter value={filter} onChange={this.onChangeFilter} />
//         <ContactList
//           contacts={visibleContacts}
//           onDeleteContacts={this.deleteContacts}
//         />
//       </Wrapper>
//     );
//   }
// }
