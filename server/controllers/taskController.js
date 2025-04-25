import { pool } from '../db.js';

export const createtask = async (req, res) => {
  const { title, description, status, project_id } = req.body;
  try {
    const created_at = new Date();
    console.log('Creating task:', created_at);
    await pool.query(
      'INSERT INTO tasks (title, description, status, project_id, created_at) VALUES ($1, $2, $3, $4, $5)',
      [title, description, status, project_id, created_at]
    );
    console.log('Task created:', title);
    res.status(201).json({ message: 'Task created' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getalltaskbyuser = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const updatetask = async (req, res) => {
  const { title, description, status, completed_at } = req.body;
  const {id} = req.params;
   console.log(completed_at)
  try {
    const completionDate = completed_at ? new Date() : null;
     console.log(completionDate)
    await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, completed_at = $4 WHERE id = $5',
      [title, description, status, completionDate, id]
    );
    console.log('Task updated:', id);
    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deletetask = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    console.log('Task deleted:', req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
