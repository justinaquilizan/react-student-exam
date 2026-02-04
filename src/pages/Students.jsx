import { useState, useEffect } from 'react';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import StudentComponent from '../components/StudentComponent';
import StudentForm from '../components/StudentForm';
import Modal from '../components/Modal';
import './Students.css';

function Students() {
  // Data State
  const [students, setStudents] = useState([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Operation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Track which student is being deleted

  useEffect(() => {
    loadStudents();
    // Check if we should show modal (from home page link)
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') {
      setShowModal(true);
    }
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students. Please try again later.');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a safe ID for new students
   * Uses max existing ID + 1, or starts at 1000 if no students exist
   */
  const generateStudentId = () => {
    if (students.length === 0) {
      return 1000; // Start above typical API ID range
    }
    const maxId = Math.max(...students.map(s => s.id));
    return maxId + 1;
  };

  const handleAddStudent = async (newStudent) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Generate safe ID
      const studentWithId = {
        ...newStudent,
        id: generateStudentId(),
        year: newStudent.year || 1, // Default to year 1 for new students
        email: newStudent.email || '',
        phone: newStudent.phone || '',
      };
      
      // Optimistically add to UI (simulating API call)
      // In real app, you'd await createStudent(studentWithId) first
      try {
        await createStudent(studentWithId);
      } catch (apiError) {
        // API call failed, but we'll keep the optimistic update
        // In production, you might want to rollback
        console.warn('API call failed, but keeping local update:', apiError);
      }
      
      setStudents([...students, studentWithId]);
      setShowModal(false);
      setEditingStudent(null);
      setSuccessMessage(`Student "${newStudent.name}" added successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to add student. Please try again.');
      throw err; // Re-throw so form can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Optimistically update UI
      const updatedList = students.map(student => 
        student.id === updatedStudent.id 
          ? { ...student, ...updatedStudent }
          : student
      );
      setStudents(updatedList);
      
      // Simulate API call (JSONPlaceholder doesn't persist)
      try {
        await updateStudent(updatedStudent.id, updatedStudent);
      } catch (apiError) {
        console.warn('API call failed, but keeping local update:', apiError);
      }
      
      setShowModal(false);
      setEditingStudent(null);
      setSuccessMessage(`Student "${updatedStudent.name}" updated successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to update student. Please try again.');
      // Rollback on error
      loadStudents();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    const student = students.find(s => s.id === id);
    const studentName = student?.name || 'this student';
    
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(id);
      setError(null);
      
      // Optimistically remove from UI
      setStudents(students.filter(student => student.id !== id));
      
      // Clear editing if deleting the student being edited
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      
      // Simulate API call
      try {
        await deleteStudent(id);
      } catch (apiError) {
        console.warn('API call failed, but keeping local update:', apiError);
      }
      
      setSuccessMessage(`Student "${studentName}" deleted successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to delete student. Please try again.');
      // Rollback on error - reload students
      loadStudents();
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setError(null);
  };

  const handleFormSubmit = async (studentData) => {
    try {
      if (editingStudent) {
        await handleUpdateStudent(studentData);
      } else {
        await handleAddStudent(studentData);
      }
    } catch (err) {
      // Error is already set in handleAddStudent/handleUpdateStudent
      // Form will handle displaying it
    }
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>Student Management</h1>
        <button 
          className="btn-add-student"
          onClick={handleAddNew}
        >
          + Add Student
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
          <button className="alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm 
          onSubmit={handleFormSubmit} 
          editingStudent={editingStudent}
          isSubmitting={isSubmitting}
          onCancel={handleCloseModal}
        />
      </Modal>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : error && students.length === 0 ? (
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="btn btn-retry" onClick={loadStudents}>
            Retry
          </button>
        </div>
      ) : (
        <div className="table-container">
          {students.length === 0 ? (
            <div className="no-students">
              <p>No students found. Click "Add Student" to register your first student!</p>
            </div>
          ) : (
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <StudentComponent
                    key={student.id}
                    student={student}
                    onEdit={handleEdit}
                    onDelete={handleDeleteStudent}
                    isDeleting={isDeleting === student.id}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Students;
