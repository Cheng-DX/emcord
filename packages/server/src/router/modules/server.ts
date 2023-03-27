import type { ServerPreview } from '@emcord/types'
import { CustomError } from '../../utils'
import { ChannelModel, ServerModel, UserModel } from '../../db/models'

export async function getServerPreview(id: string, query?: {
  memberLimit?: number
  channelLimit?: number
}) {
  const { memberLimit = 1, channelLimit = 1 } = query || {}
  const server = await findServer(id)
  const membersPreview: any = await UserModel
    .find({
      _id: { $in: server.members },
    })
    .limit(Number(memberLimit))
    .select('-servers')

  const channelsPreview: any = await ChannelModel
    .find({
      _id: { $in: server.channels },
    })
    .limit(Number(channelLimit))

  const serverPreview: ServerPreview = {
    ...server.toObject(),
    membersPreview,
    channelsPreview,
  }

  return serverPreview
}

export async function findServer(id: string, options?: {
  premission?: boolean
  userId: string
}) {
  const { premission = false, userId = '' } = options || {}
  const server = await ServerModel.findById(id)
  if (!server)
    throw new CustomError('INVALID_IDENTITY')

  if (premission && server.owner._id !== userId)
    throw new CustomError('PERMISSION_DENIED')

  else
    return server
}

const onlineUsers = new Set<string>()

export function setOnline(userId: string) {
  onlineUsers.add(userId)
}

export function setOffline(userId: string) {
  onlineUsers.delete(userId)
}
