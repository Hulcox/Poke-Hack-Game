const UserActionButton = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button className="btn btn-sm btn-primary" onClick={onAdd}>
        Add
      </button>
    </div>
  );
};

export default UserActionButton;
