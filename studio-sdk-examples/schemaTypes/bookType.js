import {defineField, defineType} from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'author'}],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'reference',
      to: [{type: 'publisher'}],
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'image',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author1FirstName: 'authors.0.firstName',
      author1LastName: 'authors.0.lastName',
      author2FirstName: 'authors.1.firstName',
      author2LastName: 'authors.1.lastName',
      cover: 'cover',
    },
    prepare: ({
      title,
      author1FirstName,
      author1LastName,
      author2FirstName,
      author2LastName,
      cover,
    }) => {
      const author1 = `${author1FirstName} ${author1LastName}`
      const author2 = `${author2FirstName} ${author2LastName}`
      return {
        title,
        subtitle: author2FirstName ? [author1, author2].join(', ') : author1,
        media: cover,
      }
    },
  },
})
