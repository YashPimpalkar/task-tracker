
import { pool } from '../db.js';




// Create a new project
export const createProject = async (req, res) => {
    const { name, user_id } = req.body;
  
    try {
      // Check number of projects already created
      const existing = await pool.query('SELECT COUNT(*) FROM projects WHERE user_id = $1', [user_id]);
  
      if (parseInt(existing.rows[0].count) >= 4) {
        return res.status(400).json({ error: 'Project limit reached (max 4)' });
      }
  
      await pool.query('INSERT INTO projects (name, user_id) VALUES ($1, $2)', [name, user_id]);
      res.status(201).json({ message: 'Project created' });
  
    } catch (err) {
      console.error("Create project error:", err);
      res.status(500).json({ error: 'Failed to create project' });
    }
  };


  export const getProjectsByUser = async (req, res) => {
    const { uid } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM projects WHERE user_id = $1', [uid]);
      res.json(result.rows);
  
    } catch (err) {
      console.error("Fetch projects error:", err);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  };

  export const deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      
      // First delete all tasks associated with the project
      await pool.query('DELETE FROM tasks WHERE project_id = $1', [projectId]);
      
      // Then delete the project
      await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
      
      res.status(200).json({ message: 'Project and associated tasks deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  };

