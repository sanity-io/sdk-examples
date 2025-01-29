import {defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      photo: 'photo',
    },
    prepare: ({firstName, lastName, photo}) => ({
      title: `${firstName} ${lastName}`,
      media: photo,
    }),
  },
})
