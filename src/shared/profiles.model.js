import { model, Schema } from 'ottoman';

const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  pass: { type: String, required: true },
})

ProfileSchema.index.findByName = { by: 'name', type: 'n1ql' };

const ProfileModel = model('profile', ProfileSchema);

module.exports = {
  ProfileModel
}