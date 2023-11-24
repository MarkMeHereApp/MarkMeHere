'use server';

import 'server-only';
import { generateTypedError } from '@/server/errorTypes';

export const submitContactUsForm = async (req: any) => {
  try {
    const json = JSON.stringify(req);

    if (!process.env.DEMO_CONTACTUS_WEBHOOK) {
      throw generateTypedError(new Error('No webhook found'));
    }

    fetch(process.env.DEMO_CONTACTUS_WEBHOOK.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: json
      })
    }).catch((error) => {
      throw generateTypedError(error as Error);
    });

    return {
      message: 'We Got Your Message!'
    };
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
