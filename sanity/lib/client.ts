import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, token } from '../env';

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
  ...(token && { token }),
});
