// pages/api/upload.ts

import { put } from '@vercel/blob';
import { NextApiResponse } from 'next';

export default async function handler(req, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
    const filename = searchParams.get('filename');

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    try {
      // The file is in req.body due to body parsing being disabled
      const blob = await put(filename, req.body, {
        access: 'public',
      });

      // Return the URL of the uploaded file
      return res.status(200).json(blob);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
