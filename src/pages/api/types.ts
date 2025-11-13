import type { NextApiRequest, NextApiResponse } from 'next';

export { type TGlobalThis, type TNextApiResponse } from '@/types/api';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
	res.status(405).json({ ok: false });
};

export default handler;
