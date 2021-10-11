import Message from './Message';
import styled from 'styled-components';
// import SeparatorDate from './SeparatorDate';

const ContainerAllMessages = styled.div`
  overflow-y: scroll;
  height: 100%;
  margin-top: 5px;

  ::-webkit-scrollbar {
    width: 8px;
    height: 0;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    background-color: rgba(199, 199, 199, 0.7);
  }
`;

export default function MessageContainer({ userSelected }) {
  return (
    <ContainerAllMessages>
      {userSelected &&
        userSelected.messages.map((message, index) => {
          const author = message.fromSelf
            ? 'Tú'
            : userSelected.isChannel
            ? message.sender
            : userSelected.name;
          return <Message key={index} message={message.content} author={author} />;
        })}
      {/* <SeparatorDate /> */}
    </ContainerAllMessages>
  );
}
