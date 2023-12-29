import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      const { prompt, systemPrompt } = req.body;

      let prediction = await replicate.deployments.predictions.create(
        "iverfinne",
        "puppy",
        {
          input: {
            prompt,
            system_prompt: systemPrompt,
            temperature: 0.3,
            max_new_tokens: -1,
            repeat_penalty:
            1.2,
            predictions: 1,
            prompt_template: "system\n{system_prompt}\nuser\n{prompt}\nassistant"
          },
          stream: true, 
       
        }
      );

      prediction = await replicate.wait(prediction);

      res.status(200).json({ output: prediction.output });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching prediction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
