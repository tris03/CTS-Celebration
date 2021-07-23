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
    *[ _type == "backgroundpage" && !(_id in path("drafts.**")) ]
    {
       title,mainContent,mainContent2{
        ...,
        markDefs[]{
          ...,
          _type == "internalLink" => {
            "slug": @.reference->slug
          }
        }
      }
    } | order(publishedAt desc)
  `
  const params = {}
  
  return await client.fetch(query, params)
}