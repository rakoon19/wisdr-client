const baseURL = 'http://localhost:5000'; // Define explicitly to avoid client-side env stripping

export const serverAction = async (path) => {
  try {
    const response = await fetch(`${baseURL}${path}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("Server Action Fetch Error:", error.message);
    throw error;
  }
};