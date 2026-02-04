import { useState, useEffect, useRef } from 'react';
import './StudentForm.css';

function StudentForm({ onSubmit, editingStudent, isSubmitting, onCancel }) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name || '');
      setCourse(editingStudent.course || '');
    } else {
      setName('');
      setCourse('');
    }
    // Clear errors when switching between add/edit mode
    setErrors({});
    
    // Scroll to form when editing
    if (editingStudent && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingStudent]);

  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Name is required';
    }
    if (trimmed.length < 2) {
      return 'Name must be at least 2 characters';
    }
    // Check for alphabetic characters (allowing spaces and hyphens)
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
      return 'Name should contain only letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const validateCourse = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Course is required';
    }
    if (trimmed.length < 2) {
      return 'Course must be at least 2 characters';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourse(value);
    // Clear error when user starts typing
    if (errors.course) {
      setErrors({ ...errors, course: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const nameError = validateName(name);
    const courseError = validateCourse(course);
    
    if (nameError || courseError) {
      setErrors({
        name: nameError,
        course: courseError,
      });
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      await onSubmit({
        name: name.trim(),
        course: course.trim(),
        ...(editingStudent && { id: editingStudent.id })
      });
      
      // Reset form only after successful submission
      if (!editingStudent) {
        setName('');
        setCourse('');
      }
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    setName('');
    setCourse('');
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form ref={formRef} className="student-form" onSubmit={handleSubmit}>
      {editingStudent && (
        <div className="edit-mode-indicator">
          <span className="edit-mode-badge">Edit Mode</span>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Name: <span className="required">*</span></label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          placeholder="Enter student name"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="course">Course: <span className="required">*</span></label>
        <input
          type="text"
          id="course"
          value={course}
          onChange={handleCourseChange}
          disabled={isSubmitting}
          placeholder="Enter course"
          className={errors.course ? 'input-error' : ''}
        />
        {errors.course && <span className="error-message">{errors.course}</span>}
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (editingStudent ? 'Updating...' : 'Adding...') 
            : (editingStudent ? 'Update Student' : 'Add Student')
          }
        </button>
        {editingStudent && (
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
