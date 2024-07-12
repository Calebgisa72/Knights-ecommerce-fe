import React, { useEffect, useState, useRef } from 'react';
import { Bot, BotMessageSquare, SendHorizontal, X } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { RootState, AppDispatch } from '../../redux/store';
import { setMessages } from '../../redux/reducers/chatMessagesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/actions/chatAction';
import toast from 'react-hot-toast';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return toast.error('Please compose a message');
    if (newMessage.trim()) {
      dispatch(setMessages({ message: newMessage, status: 'success' }));
      setNewMessage('');
      dispatch(
        sendMessage({
          message: newMessage
        })
      );
    }
  };

  //message state and actions
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="z-[99999]">
      {isOpen && (
        <div className="fixed bottom-0 right-0 mr-4 mb-20 w-[90vw] h-[80vh] sm:w-[400px] sm:h-[500px] flex flex-col shadow-lg rounded-lg border-[2px] border-grey3 p-1 bg-white overflow-hidden z-[99999]">
          <div className="h-[5vh] sm:h-[50px] w-full bg-primary flex items-center p-4 gap-2 rounded-t-lg">
            <h1 className="text-white font-poppins font-medium">Chatbot</h1>
            <Bot strokeWidth={2.5} className="text-white font-poppins font-medium" role="testRole" />
          </div>
          <div className="flex flex-col h-full bg-white">
            <div className="h-[65vh] sm:h-[370px] w-full flex flex-col justify-items-end p-2 overflow-x-hidden overflow-y-auto">
              {messages.length === 0 && (
                <div className="w-full flex items-center justify-center">
                  <p className="font-poppins font-normal text-grey4">No messages yet, start chatting</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[90%] mb-2 rounded-2xl ${
                    message.sender === 'user' ? 'rounded-br-none bg-grey6' : 'rounded-tl-none bg-grey6'
                  } px-5 py-3`}
                >
                  <p className="font-poppins font-normal text-primary">{message.message}</p>
                </div>
              ))}
              {loading && (
                <div className="w-full flex items-center justify-start p-2">
                  <BeatLoader color="#000000" size={10} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="h-[5vh] sm:h-[50px] w-full border-t border-grey3 bg-white px-2 py-4 rounded-b-lg">
              <form className="w-full flex items-center gap-2" onSubmit={(event) => handleSendMessage(event)}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full border-[1.5px] border-grey1 rounded-sm outline-none h-[40px] py-0 px-2 font-poppins font-normal text-grey4"
                  placeholder="Type something here"
                  role="testInputRole"
                />
                <button
                  className="h-[40px] w-[60px] flex items-center justify-center bg-primary rounded-sm border border-primary"
                  role="sendButton"
                >
                  <SendHorizontal className="text-white font-poppins" strokeWidth={1.5} role="testRole" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed bottom-0 right-0 mr-4 mb-4 w-[50px] h-[50px] rounded-full bg-orange flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        role="testButtonRole"
      >
        {isOpen ? (
          <X strokeWidth={2} className="text-white" role="testRole" />
        ) : (
          <BotMessageSquare strokeWidth={2} className="text-white" role="testRole" />
        )}
      </div>
    </div>
  );
}

export default Chatbot;
