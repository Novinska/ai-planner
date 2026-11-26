import React from "react";
import classNames from "classnames";
import "../styles/chatmessage.scss";

export const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === "user";

  const rowClass = classNames("chat-row", {
    "row-user": isUser,
    "row-ai": !isUser,
  });

  const bubbleClass = classNames("chat-bubble", {
    "bubble-user": isUser,
    "bubble-ai": !isUser,
  });

  const renderReplanTasks = () => {
    if (isUser || !msg.updatedTasks || msg.updatedTasks.length === 0)
      return null;

    return (
      <div className="ai-replan-container">
        <span className="ai-replan-title">
          Автоматичне перепланування Матриці:
        </span>
        {msg.updatedTasks.map((task, tIndex) => (
          <div key={tIndex} className="ai-replan-item">
            <span className="ai-replan-task-name">«{task.title}»</span>{" "}
            перенесено.
            {task.deadline && (
              <span className="ai-replan-date">
                {" "}
                Новий дедлайн:{" "}
                {new Date(task.deadline).toLocaleDateString("uk-UA")}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={rowClass}>
      <div className={bubbleClass}>
        <p className="chat-bubble-text">{msg.text}</p>
      </div>
      {renderReplanTasks()}
    </div>
  );
};
