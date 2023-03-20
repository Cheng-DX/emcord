export const toJSON = {
  virtuals: true,
  transform(_doc: any, ret: any) {
    ret.id = ret._id
    delete ret._id
  },
}
