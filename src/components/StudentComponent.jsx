import './StudentComponent.css';

function StudentComponent({ student, onEdit, onDelete, isDeleting }) {
  const handleDelete = () => {
    onDelete(student.id);
  };

  return (
    <tr className={`student-row ${isDeleting ? 'deleting' : ''}`}>
      <td className="student-id">{student.id}</td>
      <td className="student-name">{student.name}</td>
      <td className="student-course">{student.course || 'Undeclared'}</td>
      <td className="student-year">{student.year || '-'}</td>
      <td className="student-email">{student.email || '-'}</td>
      <td className="student-actions">
        <button 
          className="btn-action btn-edit" 
          onClick={() => onEdit(student)}
          disabled={isDeleting}
          title="Edit student"
        >
          ✏️
        </button>
        <button 
          className="btn-action btn-delete" 
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete student"
        >
          {isDeleting ? '⏳' : '🗑️'}
        </button>
      </td>
    </tr>
  );
}

export default StudentComponent;
