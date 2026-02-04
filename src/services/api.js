const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Transform JSONPlaceholder user data to student domain model
 * Maps: company.name -> course, generates year (1-4), preserves useful fields
 */
const transformUserToStudent = (user) => {
  // Generate a realistic year (1-4) based on user ID for variety
  const year = (user.id % 4) + 1;
  
  return {
    id: user.id,
    name: user.name,
    course: user.company?.name || 'Undeclared',
    year: year,
    email: user.email,
    phone: user.phone,
    address: `${user.address?.street}, ${user.address?.city}`,
  };
};

/**
 * Fetch all students from the API
 * @returns {Promise<Array>} Array of transformed student objects
 * @throws {Error} If the API request fails
 */
export const fetchStudents = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
    }
    
    const users = await response.json();
    // Transform API data to student domain model
    return users.map(transformUserToStudent);
  } catch (error) {
    console.error('Error in fetchStudents:', error);
    throw new Error(`Unable to load students. ${error.message}`);
  }
};

/**
 * Create a new student (simulated - JSONPlaceholder doesn't persist)
 * @param {Object} studentData - Student data to create
 * @returns {Promise<Object>} Created student object with generated ID
 * @throws {Error} If the creation fails
 */
export const createStudent = async (studentData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: studentData.name,
        company: { name: studentData.course },
        email: studentData.email || '',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create student: ${response.status} ${response.statusText}`);
    }
    
    const createdUser = await response.json();
    // Transform to student model
    return transformUserToStudent(createdUser);
  } catch (error) {
    console.error('Error in createStudent:', error);
    throw new Error(`Unable to create student. ${error.message}`);
  }
};

/**
 * Update an existing student (simulated - JSONPlaceholder doesn't persist)
 * @param {number} id - Student ID to update
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student object
 * @throws {Error} If the update fails
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        name: studentData.name,
        company: { name: studentData.course },
        email: studentData.email || '',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update student: ${response.status} ${response.statusText}`);
    }
    
    const updatedUser = await response.json();
    // Transform to student model
    return transformUserToStudent(updatedUser);
  } catch (error) {
    console.error('Error in updateStudent:', error);
    throw new Error(`Unable to update student. ${error.message}`);
  }
};

/**
 * Delete a student (simulated - JSONPlaceholder doesn't persist)
 * @param {number} id - Student ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If the deletion fails
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete student: ${response.status} ${response.statusText}`);
    }
    
    // JSONPlaceholder returns empty object on successful delete
    return;
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    throw new Error(`Unable to delete student. ${error.message}`);
  }
};
