import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://anonymous-chat-backend-production.up.railway.app", {
  transports: ["websocket"],
});


function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior : "smooth"});
  },[chat]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message });
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="chat-header">れんが亭匿名チャットルーム</div>

      <div className="chat-container">
        {chat.map((msg, index) => (
          <div key={index} className="chat-bubble">
            <span className="user">匿名</span>
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref ={chatEndRef} />
      </div>

      <div className="input-container">
        <input
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="chat-button" onClick={sendMessage}>
          送信
        </button>
      </div>
    </div>
  );
}

export default App;
