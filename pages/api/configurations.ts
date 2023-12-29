// pages/api/configurations.ts
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case 'POST': {
        const { name, systemPrompt, avatar, description, starters } = req.body;
        await sql`
          INSERT INTO configurations (name, system_prompt, avatar, description, starters)
          VALUES (${name}, ${systemPrompt}, ${avatar}, ${description}, ${starters})
        `;
        return res.status(201).json({ message: 'Configuration created successfully.' });
      }
      case 'GET': {
        const { rows } = await sql`SELECT * FROM configurations`;
        return res.status(200).json(rows);
      }
      case 'DELETE': {
        const configId = req.query.id; // The id should be passed as a query parameter
        if (!configId) {
          return res.status(400).json({ message: 'Configuration ID is required.' });
        }
        await sql`
          DELETE FROM configurations
          WHERE id = ${configId}
        `;
        return res.status(200).json({ message: 'Configuration deleted successfully.' });
      }
      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
