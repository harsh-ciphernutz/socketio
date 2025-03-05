const User = (props: { name: string; onClick: () => void }) => {
  return (
    <div
      className="w-20 h-20 bg-red-300 rounded-2xl flex justify-center items-center cursor-pointer select-none"
      onClick={props.onClick}
    >
      {props.name}
    </div>
  );
};

export default User;
