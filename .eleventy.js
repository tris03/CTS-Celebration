const blocksToHtml = require('@sanity/block-content-to-html')
const CleanCSS = require("clean-css");
const slugify = require("slugify");

// `h` is a way to build HTML known as hyperscript
// See https://github.com/hyperhype/hyperscript for more info
const h = blocksToHtml.h

function getYouTubeID(url)
{
  var videoId=0
  if (url&&url.includes('youtube.com/watch?')) 
  {
    videoId = url.split('v=')[1];
    if( videoId.indexOf('&') != -1 ) 
    {
      videoId = videoId.substring(0, ampersandPosition);
    }
  }
  return videoId;
}


const serializers = {
  types: 
  {
    youtube: props => 
    h('div', {
      innerHTML: `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${getYouTubeID(props.node.url)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>        
        `
    })
    ,
    padlet: props => (
      h('div', { innerHTML: props.node.embedCode }
      )
    )
  },
  marks: 
  {
    internalLink: ({mark, children}) => {
      const {slug = {}} = mark
      const href = `/${slug}`
      return `[${children}](${href})`
    },
    link: ({mark, children}) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = mark
      return blank ?
        h('a', {href: href, target:'_blank', rel: 'noopener'} , children )
        : `[${children}](${href})`
    }

  }
}



module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("images/");
    eleventyConfig.addPassthroughCopy("css/");
    eleventyConfig.addPassthroughCopy("files/");

    eleventyConfig.addFilter('schoolFilter', function(collection, schoolName) {
      if (!schoolName) return collection;
        const filtered = collection.filter(item => item.school == schoolName)
        return filtered;
    });

    eleventyConfig.addFilter('countryFilter', function(collection, country) {
      if (!country) return collection;
        const filtered = collection.filter(item => item.country == country)
        return filtered;
    });


    eleventyConfig.addFilter('localeContent', function(values,key)
    {
      return values;
    })

    eleventyConfig.addFilter('sanityToHTML', function(value) {
      return blocksToHtml({
        blocks: value,
        serializers: serializers,
        projectId: '3vgpwmyb',
        dataset: 'production',
      })
    })

    eleventyConfig.addFilter("slug", (input) => {
      const options = {
        replacement: "-",
        remove: /[&,+()$~%.'":*?<>{}]/g,
        lower: true
      };
      return slugify(input, options);
    });

    eleventyConfig.addFilter("cssmin", function(code) {
      return new CleanCSS({}).minify(code).styles;
    });
    return {
      templateFormats: [
        "md",
        "njk",
        "html",
        "liquid"
      ],
  
      // If your site lives in a different subdirectory, change this.
      // Leading or trailing slashes are all normalized away, so don’t worry about it.
      // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
      // This is only used for URLs (it does not affect your file structure)
      pathPrefix: "/",
      markdownTemplateEngine: "njk",
      htmlTemplateEngine: "njk",
      dataTemplateEngine: "njk",
      passthroughFileCopy: true,
      dir: {
        input: ".",
        includes: "_includes",
        data: "_data",
        output: "_site"
      }
    };  
  };