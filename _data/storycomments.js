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
  *[ _type == "storyComment" && !(_id in path("drafts.**")) ]{
    name,
    school,
    comment,
    "storyId": story->_id
  } | order(publishedAt desc)
  `
  const params = {}
  
  return await client.fetch(query, params)
}