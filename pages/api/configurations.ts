// pages/api/configurations.ts
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Assuming body has { name, systemPrompt, avatar } structure
      const { name, systemPrompt, avatar } = req.body;
      await sql`
        INSERT INTO configurations (name, system_prompt, avatar)
        VALUES (${name}, ${systemPrompt}, ${avatar})
      `;
      res.status(201).json({ message: 'Configuration created successfully.' });
    } else if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM configurations`;
      res.status(200).json(rows);
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}