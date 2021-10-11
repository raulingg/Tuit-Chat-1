import styled from 'styled-components';

const Detail = styled.details`
  margin-top: 30px;
  & summary {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  & p {
    margin: 0;
    padding: 10px 0 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
  }
`;

const Connected = styled.span`
  ::after {
    content: '';
    position: absolute;
    background-color: ${({ connected }) => (connected ? 'rgb(164, 226, 19)' : 'none')};
    border: ${({ connected }) => (connected ? 'none' : '2px solid rgb(196, 196, 196)')};
    border-radius: 50%;
    top: 17px;
    left: 8px;
    width: 10px;
    height: 10px;
  }
`;

function ContactList({ category, list, onSelectUser }) {
  return (
    <Detail open>
      <summary>{category}</summary>
      {list.map((element, index) => (
        <p
          key={index}
          onClick={() => onSelectUser(element)}
          className="hover:bg-purple-400"
        >
          {!element.isChannel && (
            <Connected className="mr-2" connected={element.connected}></Connected>
          )}
          {element.name}
        </p>
      ))}
    </Detail>
  );
}

export default ContactList;
