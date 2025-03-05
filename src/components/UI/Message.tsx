const Message = (props: {
  message: string;
  name: string;
  sending: boolean;
}) => {
  return (
    <div
      className={`bg-gray-800 p-3 m-3 w-fit rounded-2xl max-w-2/3 break-words ${
        props.sending ? "self-end" : "self-start"
      }`}
    >
      <h6 className="text-[12px] ">{props.name}</h6>
      <p className="text-[16px]  ">{props.message}</p>
    </div>
  );
};

export default Message;
