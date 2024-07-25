const EditButton = ({
  text,
  handleClick,
}: {
  text: string;
  handleClick: () => void;
}) => (
  <button className="" onClick={handleClick}>
    {text}
    <i className="fa-solid fa-pen pl-1"></i>
  </button>
);

export default EditButton;
