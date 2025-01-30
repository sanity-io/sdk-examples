import {defineField, defineType} from 'sanity'

export const publisherType = defineType({
  name: 'publisher',
  title: 'Publisher',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
