const sanityClient = require('@sanity/client')
const projectId = "3vgpwmyb"
const apiToken = ''
const client = sanityClient({
  projectId,
  dataset: 'production',
  token: '',
  useCdn: false
})


module.exports = async function () {
  const query = `
    *[ _type == "story" && ready_for_website == true && !(_id in path("drafts.**")) ]{
       "storyId" : _id,
       name,
       description,
       who_created,
       how_created,
       "country": country->name,
       "school": school->name,
       tags,
       "mainImageUrl": mainImage.asset->url,
       content,
    } | order(publishedAt desc)
  `
  const params = {}
  
  return await client.fetch(query, params)
}