import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { engagementToolsValidationSchema } from 'validationSchema/engagement-tools';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.engagement_tools
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEngagementToolsById();
    case 'PUT':
      return updateEngagementToolsById();
    case 'DELETE':
      return deleteEngagementToolsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEngagementToolsById() {
    const data = await prisma.engagement_tools.findFirst(convertQueryToPrismaUtil(req.query, 'engagement_tools'));
    return res.status(200).json(data);
  }

  async function updateEngagementToolsById() {
    await engagementToolsValidationSchema.validate(req.body);
    const data = await prisma.engagement_tools.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEngagementToolsById() {
    const data = await prisma.engagement_tools.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
