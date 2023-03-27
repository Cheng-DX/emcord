import { ServerModel, UserModel } from '../../db/models'
import { CustomError } from '../../utils'

export async function findUser(id: string) {
  const result = await UserModel.findById(id)
  if (!result)
    throw new CustomError('INVALID_USER')
  else
    return result
}

export async function findUserServers(id: string, limit = 1) {
  const { servers } = await findUser(id)
  const serverList = await ServerModel
    .find({
      _id: {
        $in: servers,
      },
    })
    .limit(limit)

  return serverList
}
