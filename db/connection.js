import mysql from 'mysql2/promise';

// Function to establish a connection to the database
export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'company_db'
    });

    console.log('Connected to the database.');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
}
