const InputText = (props: {
  value: string;
  onChange: (data: string) => void;
  placeHolder: string;
  type?: string;
}) => {
  return (
    <div>
      <input
        type={props.type || "text"}
        placeholder={props.placeHolder}
        value={props.value} // Ensure input value is controlled
        onChange={(e) => props.onChange(e.target.value)} // Properly update parent state
        className="bg-gray-800 p-2 text-white placeholder:text-white border border-gray-600 rounded-2xl"
      />
    </div>
  );
};

export default InputText;
