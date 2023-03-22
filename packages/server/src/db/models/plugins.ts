export const toJSON = {
  virtuals: true,
  transform(_doc: any, ret: any) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
}

export const toObject = {
  virtuals: true,
  transform(_doc: any, ret: any) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
}
